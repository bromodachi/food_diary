import { AddingOrEditingMealType } from "@/model/UserEntries.tsx";

type ClickableDay = {
  onClick: (addingOrEditing: AddingOrEditingMealType) => void;
  clickKey: string;
  userInfo: AddingOrEditingMealType;
};

export function ClickableDay({ onClick, clickKey, userInfo }: ClickableDay) {
  // TODO: Make configurable
  const MAX_ENTRIES = 5;
  return (
    <div key={clickKey} className="">
      {
        <div
          className="font-black text-sm min-h-24"
          onClick={() => onClick(userInfo)}
        >
          <ul className="truncate">
            {userInfo.entries.slice(0, MAX_ENTRIES).map((userEntry, index) => {
              return (
                <li key={`${clickKey}-user-entry-${index}`}>
                  <p className="truncate pl-1">
                    {" "}
                    {index + 1}. {userEntry}
                  </p>
                </li>
              );
            })}
            {userInfo.entries.length > MAX_ENTRIES && <li>...</li>}
          </ul>
        </div>
      }
    </div>
  );
}
