import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AddingOrEditingMealType, DiaryEntry } from "@/model/UserEntries.tsx";
import {
  createEntries,
  maybeReloadEntries,
  updateEntries,
} from "@/repository/DiaryRepository";
import { Result } from "@/utils/Result";
import { LoadingButton } from "@/components/ui/loading-button";
import { OnError } from "@/model/OnError";
import { ALERT_MESSAGES } from "../constants/ALERT_MESSAGES";

const meals = z.object({
  entry: z
    .string()
    .transform((t: string) => t?.trim())
    .pipe(z.string().min(1)),
});

const formSchema = z.object({
  meals: z.array(meals),
});

export class AddOrEditCurrentMealState {
  isOpen: boolean = false;
  userInfo: AddingOrEditingMealType | undefined;
}

export interface AddOrEditCurrentMealProps {
  handleClose: () => void;
  onUpdate: (meals?: DiaryEntry, onError?: OnError) => void;
  state: AddOrEditCurrentMealState;
}

export function AddOrEditCurrentMealDialog({
  handleClose,
  state,
  onUpdate,
}: AddOrEditCurrentMealProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      meals: [],
    },
  });
  const { isOpen, userInfo } = state;

  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: "meals",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userInfo) {
      return;
    }

    let promise: Promise<Result<DiaryEntry, OnError>>;
    if (userInfo.id) {
      promise = updateEntries(userInfo.id, {
        meal: userInfo.mealType,
        entries: values.meals.map((entry) => entry.entry),
      });
    } else {
      promise = createEntries({
        date: userInfo.date,
        meal: userInfo.mealType,
        entries: values.meals.map((entry) => entry.entry),
      });
    }
    setIsLoading(true);
    promise
      .then((response) => {
        if (response.tag === "success") {
          onUpdate(response.value);
        } else if (maybeReloadEntries(response.value.statusCode)) {
          onUpdate(undefined, response.value);
        } else {
          alert(response.value.msg);
        }
      })
      .catch((_e) => {
        alert(ALERT_MESSAGES.DIALOG.FAILED_TO_ADD_OR_UPDATE_ENTRIES);
      })
      .then(() => {
        setIsLoading(false);
      });
  }

  const handleOnOpenChange = (newValue: boolean) => {
    if (!newValue) {
      handleClose();
    }
  };

  useEffect(() => {
    form.reset({
      meals:
        userInfo?.entries?.map((m) => {
          return { entry: m };
        }) ?? [],
    });
  }, [form, userInfo, isOpen]);

  return (
    <Dialog open={state.isOpen} onOpenChange={handleOnOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {`${userInfo?.date ? `Date Selected: ${userInfo?.date ?? "."}` : ""} `}
            <br></br>Editing meal: {userInfo?.mealType ?? ""}.
          </DialogTitle>
          <div className="min-h-24">
            <Form {...form}>
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto pb-1">
                  {fields.map((item, index) => {
                    return (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name={`meals.${index}.entry`}
                        render={({ field }) => (
                          <FormItem className="px-2 flex flex-row gap-2">
                            <FormLabel className="flex h-full justify-center items-center px-2 text-center">
                              Meal {index + 1}:
                            </FormLabel>
                            <FormControl>
                              <Input {...field} className="flex-grow"></Input>
                            </FormControl>
                            <FormMessage />
                            <Button
                              variant="destructive"
                              onClick={() => remove(index)}
                            >
                              <Trash2 />
                            </Button>
                          </FormItem>
                        )}
                      />
                    );
                  })}
                </div>
                <div className="flex flex-row gap-x-2 justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={fields.length >= 50}
                    onClick={() => {
                      append({
                        entry: "",
                      });
                    }}
                  >
                    Add item
                  </Button>
                  <LoadingButton
                    variant="default"
                    type="submit"
                    loading={isLoading}
                  >
                    Finish
                  </LoadingButton>
                </div>
              </form>
            </Form>
          </div>
          <DialogDescription>
            All entries are in-memory and will be destroyed if the server shut
            downs or crashes.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
