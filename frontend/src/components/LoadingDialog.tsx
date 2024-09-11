import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

type LoadingDialogState = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export function LoadingDialog({ open, setOpen }: LoadingDialogState) {
  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">
              Loading...
            </AlertDialogTitle>
            <AlertDialogDescription>Please wait...</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="overflow-hidden flex justify-center">
            <LoadingSpinner></LoadingSpinner>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
