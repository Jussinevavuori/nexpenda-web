import { useMemo, useState } from "react";
import { useIsPremium } from "../../hooks/application/useIsPremium";
import { useRedirect } from "../../hooks/utils/useRedirect";
import { chunkify } from "../../lib/Utilities/chunkify";
import { useStoreActions, useStoreState } from "../../store";
import { SpreadsheetReadFileResult } from "../../lib/FileIO/Spreadsheet";
import { TransactionSpreadsheet } from "../../lib/FileIO/TransactionSpreadsheet";
import { FileUploaderProps } from "./FileUploader";

const steps = {
  upload: 0,
  review: 1,
  finished: 2,
};

export function useFileUploaderController(props: FileUploaderProps) {
  const massPostTransactions = useStoreActions(
    (_) => _.transactions.massPostTransactions
  );

  const redirect = useRedirect();

  const isPremium = useIsPremium();
  const transactions = useStoreState((_) => _.transactions.items);
  const transactionsCount = useMemo(() => transactions.length, [transactions]);
  const transactionsLimit = useStoreState(
    (_) => _.appConfig.value
  ).freeTransactionsLimit;

  function handleUpgrade() {
    redirect((_) => _.subscribe);
  }

  /**
   * State of reading uploaded spreadsheet file
   */
  const [readFileState, setReadFileState] = useState<{
    result?: SpreadsheetReadFileResult<SpreadsheetTransaction>;
    isParsing: boolean;
    error?: string;
  }>({ isParsing: false });

  /**
   * All sheet names
   */
  const sheetNames = Object.keys(readFileState.result?.sheets ?? {});

  /**
   * Currently selected sheet name
   */
  const [selectedSheetName, setSelectedSheetName] = useState("");

  /**
   * Currently selected sheet
   */
  const selectedSheet = readFileState.result
    ? readFileState.result.sheets[selectedSheetName]
    : undefined;

  /**
   * Does the currently selected sheet have too many transaciotns
   */
  const tooManyTransactions =
    !isPremium &&
    (selectedSheet?.result.rows.length ?? 0) + transactionsCount >
      transactionsLimit;

  /**
   * State of uploading selected sheet to server
   */
  const [uploadFileState, setUploadFileState] = useState<{
    isUploading: boolean;
    error?: string;
    isSuccesful?: boolean;
  }>({ isUploading: false });

  /**
   * Get and parse uploaded spreadsheet
   */
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    setReadFileState({ isParsing: true });

    // Read the result to a transaction spreadsheet
    const transactionSpreadsheet = new TransactionSpreadsheet();
    const readResult = await transactionSpreadsheet.readFile(e.target);

    // If read succeeded, show result, else show error
    if (readResult.isSuccess()) {
      setReadFileState({ result: readResult.value, isParsing: false });

      // Get the name of the sheet that had transactions, else default
      // to first sheet
      const defaultSheetName = Object.values(readResult.value.sheets).reduce(
        (name, sheet) => {
          if (!name) return sheet.sheetName;
          if (sheet.result.succeeded > 0) return sheet.sheetName;
          return name;
        },
        ""
      );

      setSelectedSheetName(defaultSheetName);
    } else {
      setReadFileState({
        isParsing: false,
        error: `Could not read file (${readResult.reason})`,
      });
    }
  }

  async function handleUploadTransactions() {
    if (!selectedSheet) {
      setUploadFileState({ isUploading: false, error: "No sheet selected" });
      return;
    } else if (selectedSheet.result.rows.length === 0) {
      setUploadFileState({
        isUploading: false,
        error: "No transactions on selected sheet",
      });
    }

    const rowsToUpload = selectedSheet.result.rows;
    setUploadFileState({ isUploading: true });

    // Chunkify rows to chunks of hundreds and post those chunks one by one
    const chunks = chunkify(rowsToUpload, 100);
    const postResults: PromiseType<ReturnType<typeof massPostTransactions>>[] =
      [];
    for (const chunk of chunks) {
      const result = await massPostTransactions(chunk);
      postResults.push(result);
    }

    // Check whether all chunks were succesfully posted
    if (postResults.every((_) => _.isSuccess())) {
      setUploadFileState({
        isUploading: false,
        isSuccesful: true,
      });
    } else {
      // Check if any failures occured
      const failure = postResults.find((_) => _.isFailure());
      if (failure && failure.isFailure())
        setUploadFileState({
          isUploading: false,
          error: "An error occured while uploading transactions.",
        });
    }
  }

  function handleResetState() {
    setReadFileState({ isParsing: false });
    setUploadFileState({ isUploading: false });
  }

  function handleFinish() {
    if (props.onFinished) {
      props.onFinished();
    }
  }

  // Currently active step
  const activeStep = (() => {
    if (!readFileState.result) return steps.upload;
    else if (!uploadFileState.isSuccesful) return steps.review;
    else return steps.finished;
  })();

  return {
    steps,
    activeStep,

    readFileState,
    uploadFileState,

    sheetNames,
    selectedSheet,
    selectedSheetName,
    setSelectedSheetName,

    handleFileUpload,
    handleUploadTransactions,
    handleFinish,
    handleResetState,

    transactionsLimit,
    tooManyTransactions,
    handleUpgrade,
    disableUpload: tooManyTransactions,
  };
}
