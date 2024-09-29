import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export class ConfirmationDialogState {
  isOpen: boolean = false;
  column: number | undefined;
  date: string | undefined;
}

export interface ConfirmationDialogProps {
  onConfirm: (column: number | undefined) => void;
  handleOnClose: () => void;
  state: ConfirmationDialogState;
}

export function ConfirmationDialog({
  onConfirm,
  handleOnClose,
  state,
}: ConfirmationDialogProps) {
  const handleOnOpenChange = (newValue: boolean) => {
    if (!newValue) {
      handleOnClose();
    }
  };

  const { isOpen, date } = state;
  return (
    <AlertDialog open={isOpen} onOpenChange={handleOnOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will clear all entries for each meal on this day({date ?? ""}).
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => onConfirm(state.column)}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
