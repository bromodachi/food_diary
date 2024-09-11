import React, { useEffect, useState } from "react";
import "./App.css";
import { cn } from "@/lib/utils.ts";
import { getWeek } from "@/utils/WeekUtil.ts";
import { ClickableDay } from "@/ClickableDay.tsx";
import {
  AddOrEditCurrentMealDialog,
  AddOrEditCurrentMealState,
} from "@/components/AddOrEditCurrentMealDialog.tsx";
import { DatePicker } from "@/components/ui/datePicker.tsx";
import {
  AddingOrEditingMealType,
  DiaryEntry,
  Entries,
  UserData,
} from "@/model/UserEntries.tsx";
import { endOfWeek, startOfWeek } from "date-fns";
import {
  apiGetEntries,
  deleteEntries,
  isStatusCodeOkay,
  maybeReloadEntries,
} from "@/repository/DiaryRepository";
import { capitalizeFirstLetter } from "@/utils/StringUtil";
import { Button } from "@/components/ui/button";
import {
  ConfirmationDialog,
  ConfirmationDialogState,
} from "@/components/ConfirmationDialog";
import { LoadingDialog } from "@/components/LoadingDialog";
import { OnError } from "@/model/OnError";
import { UTCDate } from "@date-fns/utc";
import { WebServiceErrorCode } from "@/constants/WebServiceErrorCode";
import { ALERT_MESSAGES } from "@/constants/ALERT_MESSAGES";

function App() {
  const [date, setDate] = React.useState<Date | undefined>(new UTCDate());
  const [isLoading, setIsLoading] = React.useState(false);

  const [addOrEditDialogState, setAddOrEditDialogState] =
    useState<AddOrEditCurrentMealState>({
      isOpen: false,
      userInfo: {
        entries: [],
        mealType: "",
        date: "",
      },
    });

  const [clearConfirmationDialogState, setClearConfirmationDialogState] =
    useState<ConfirmationDialogState>({
      isOpen: false,
      column: undefined,
    });

  const [weekdays, setWeekdays] = useState<Date[]>([]);

  const [userData, setUserData] = useState<UserData>({});

  const mealTypeArray: string[] = [
    "",
    "breakfast",
    "lunch",
    "dinner",
    "snacks",
    "drinks",
  ];

  const days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

  useEffect(() => {
    if (!date) {
      return;
    }
    setWeekdays(getWeek(date));
    setIsLoading(true);
    apiGetEntries(
      getDateAsString(startOfWeek(date)),
      getDateAsString(endOfWeek(date)),
    )
      .then((result) => {
        setIsLoading(false);
        setUserData(result.data);
      })
      .catch((_err) => {
        setIsLoading(false);
        alert(ALERT_MESSAGES.FAILED_TO_LOAD_ENTRIES);
      });
  }, [date]);

  // Basically a duplicate of what's inside of useEffect but also added here to not be a dependency.
  function attemptRefresh() {
    if (!date) {
      return Promise.resolve();
    }
    return apiGetEntries(
      getDateAsString(startOfWeek(date)),
      getDateAsString(endOfWeek(date)),
    )
      .then((result) => {
        setIsLoading(false);
        setUserData(result.data);
      })
      .catch((_err) => {
        setIsLoading(false);
      });
  }

  /**
   * Shows the create/edit dialog when editing a meal's entry
   * @param userInfo
   */
  function showAddOrEditDialog(userInfo: AddingOrEditingMealType) {
    setAddOrEditDialogState((_prev: AddOrEditCurrentMealState) => {
      return {
        isOpen: true,
        userInfo: {
          mealType: userInfo.mealType,
          entries: userInfo.entries,
          date: userInfo.date,
          id: userInfo.id,
        },
      };
    });
  }

  /**
   * Returns the header for the simple week view.
   * @param index
   */
  function getDayDiv(index: number) {
    if (weekdays.length < 7) {
      return;
    }
    return (
      <div className="flex flex-col">
        <div>{days[index]}</div>
        <div className="flex items-center justify-center">
          <div className="rounded-full h-12 w-12 bg-zinc-200 justify-center flex items-center text-center m-2">
            <span>{weekdays[index].getDate()}</span>
          </div>
        </div>
      </div>
    );
  }

  /**
   * For the create/edit dialog, when closed, we'll set everything back to an empty state.
   */
  function handleDialogClose() {
    setAddOrEditDialogState({
      ...addOrEditDialogState,
      isOpen: false,
      userInfo: {
        entries: [],
        mealType: "",
        date: "",
      },
    });
  }

  function padZero(num: number): string {
    if (num < 10) {
      return "0" + num;
    }
    return "" + num;
  }

  /**
   * Gets the date as a string with the format YYYY-MM-DD.
   * @param date
   */
  function getDateAsString(date: Date): string {
    return (
      date.getFullYear() +
      "-" +
      padZero(date.getMonth() + 1) +
      "-" +
      padZero(date.getDate())
    );
  }

  /**
   * For a column, retrieve the user info for that particular date.
   * @param column -
   * @param meal - must be of breakfast, lunch, dinner, snacks, or drinks.
   */
  function getUserInfo(
    column: number,
    meal: keyof Entries,
  ): AddingOrEditingMealType {
    const diaryEntry = getDiaryEntry(column);
    return {
      entries: (diaryEntry?.entries[meal] ?? []).slice(),
      mealType: meal,
      date: weekdays.length <= column ? "" : getDateAsString(weekdays[column]),
      id: diaryEntry?.id,
    };
  }

  /**
   * Actually attempts to retrieve the diary entry from the user data object.
   * If the key doesn't exist of the weekday array is not initialized yet, undefined
   * can be returned.
   * @param column
   */
  function getDiaryEntry(column: number): DiaryEntry | undefined {
    if (weekdays.length <= column) {
      return undefined;
    }
    return userData[getDateAsString(weekdays[column])];
  }

  /**
   * Updates the diary entry IFF the entry exists by creating a copy and manipulating the copy,
   * then setting it as the user data. If diaryEntry and msg is undefined, it's an unhandled bug on our side.
   *
   * @param diaryEntry - if not undefined, update the user data.
   * @param onError - if not undefined, show an error
   */
  function handleUpdate(
    diaryEntry: DiaryEntry | undefined,
    onError: OnError | undefined,
  ) {
    if (diaryEntry) {
      const dateString = getDateAsString(diaryEntry.date);
      setUserData((prev) => {
        const copy: UserData = { ...prev };
        copy[dateString] = diaryEntry;
        return copy;
      });
    } else if (onError) {
      if (maybeReloadEntries(onError.statusCode))
        attemptRefresh().then(() => {
          alert(onError.msg);
        });
    } else {
      // TODO: Use pino to log the error.
      console.error(
        `Error code: ${WebServiceErrorCode.UNKNOWN_ERROR} on handling update..`,
      );
      alert(ALERT_MESSAGES.UNKNOWN_ERROR);
    }
    handleDialogClose();
  }

  /**
   * Calls delete. May not hit the API if column or the diary entry is somehow undefined.
   * Once again, we make a copy of the previous, delete the entry from the copy and then set it.
   *
   * @param column
   */
  function callDelete(column: number | undefined) {
    if (column === undefined) return;
    const diaryEntry = getDiaryEntry(column);
    if (!diaryEntry) return;
    if (!diaryEntry.id) {
      alert(ALERT_MESSAGES.ENTRY_LACKS_ID);
      return;
    }
    setIsLoading(true);
    deleteEntries(diaryEntry.id)
      .then((statusCode: number) => {
        if (!isStatusCodeOkay(statusCode)) {
          if (maybeReloadEntries(statusCode)) {
            attemptRefresh().then(() => {
              alert(ALERT_MESSAGES.FAILED_TO_DELETE_ENTRY_ATTEMPTED_REFRESH);
            });
          } else {
            alert(ALERT_MESSAGES.FAILED_TO_DELETE_ENTRY);
          }
          return;
        }
        setUserData((prev) => {
          const copy: UserData = { ...prev };
          delete copy[getDateAsString(new UTCDate(diaryEntry.date))];
          return copy;
        });
      })
      .catch((_err) => {
        alert(ALERT_MESSAGES.FAILED_TO_DELETE_ENTRY);
      })
      .then(() => {
        setIsLoading(false);
      });
  }

  function showConfirmationDialog(column: number | undefined) {
    setClearConfirmationDialogState({
      isOpen: true,
      column: column,
    });
  }

  function handleConfirmationDialogClose() {
    setClearConfirmationDialogState({
      isOpen: false,
      column: undefined,
    });
  }

  return (
    <>
      <div>
        <LoadingDialog open={isLoading} setOpen={setIsLoading}></LoadingDialog>
        <ConfirmationDialog
          onConfirm={callDelete}
          handleOnClose={handleConfirmationDialogClose}
          state={clearConfirmationDialogState}
        ></ConfirmationDialog>
        <AddOrEditCurrentMealDialog
          state={addOrEditDialogState}
          handleClose={handleDialogClose}
          onUpdate={handleUpdate}
        />
        <h2 className="text-xl p-2">Basic Food Diary</h2>
        <div className="p-2">
          <DatePicker setDate={setDate} state={{ date: date }}></DatePicker>
        </div>
        <div className="flex flex-col divide-y w-[760px] md:w-[1216px]">
          {mealTypeArray.map((meal, row) => (
            <div key={`meal-day-${row}`} className="grid grid-cols-8 divide-x">
              {/*The meal(breakfast, lunch, dinner) column*/}
              {
                <div
                  className={cn(
                    "border-l ",
                    row === 0 ? "!border-t" : "",
                    row === 0 ? "" : "max-h-96 min-h-8",
                  )}
                >
                  {capitalizeFirstLetter(meal)}
                </div>
              }
              {/*The rest of the columns that list the entries or the day header*/}
              {days.map((_day, column) => (
                <div
                  key={`day-${row}-${column}`}
                  className={cn(
                    "flex flex-col ",
                    row === 0 ? "!border-t" : "",
                    column === days.length - 1 ? "!border-r" : "",
                  )}
                >
                  {/*Day header*/}
                  {row === 0 ? (
                    <span className="">{getDayDiv(column)}</span>
                  ) : (
                    //  Clickable day. If clicked, we show the alert dialog
                    <ClickableDay
                      onClick={showAddOrEditDialog}
                      userInfo={getUserInfo(column, meal as keyof Entries)}
                      clickKey={`clickable-key-${row}-${column}`}
                    ></ClickableDay>
                  )}
                </div>
              ))}
            </div>
          ))}
          {/*Adding clear row.*/}
          <div
            key={`meal-day-clear-row}`}
            className="grid grid-cols-8 divide-x "
          >
            <div className="border-b border-l"></div>
            {days.map((_day, column) => (
              // Div to hold the button
              <div
                key={`clear-day-${column}`}
                className={cn(
                  "flex flex-col !border-b",
                  column === days.length - 1 ? "!border-r" : "",
                )}
              >
                {/*Only enable the button if the id is set.*/}
                <Button
                  variant="destructive"
                  className="m-3 min-h-12 min-w-8"
                  onClick={() => showConfirmationDialog(column)}
                  disabled={getDiaryEntry(column)?.id === undefined}
                >
                  Clear<br></br>Day
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
