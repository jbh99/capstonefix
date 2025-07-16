import React, { useState } from "react";
import { useAtomValue } from "jotai";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { selectedSeatAtom } from "@/store/atoms";

// Form validation schema
const seatFormSchema = z.object({
  x: z.number().min(0),
  y: z.number().min(0),
  w: z.number().min(0.5).optional(),
  h: z.number().min(0.5).optional(),
  r: z.number().optional(),
  rx: z.number().optional(),
  ry: z.number().optional(),
});

type SeatFormValues = z.infer<typeof seatFormSchema>;

export const SeatEditForm: React.FC = () => {
  const selectedSeat = useAtomValue(selectedSeatAtom);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form with default values from the selected seat
  const form = useForm<SeatFormValues>({
    resolver: zodResolver(seatFormSchema),
    defaultValues: {
      x: 0,
      y: 0,
      w: 1,
      h: 1,
      r: 0,
      rx: undefined,
      ry: undefined,
    },
  });

  const onSubmit = async (values: SeatFormValues) => {
    setIsSubmitting(true);
    try {
      // Here you would call an API to update the seat position
      console.log("Updating seat position:", values);
      // Wait for API response
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Handle success (would normally be in the API response)
      console.log("Seat position updated successfully");
    } catch (error) {
      console.error("Failed to update seat position:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedSeat) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Edit Seat Position</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-gray-500'>Select a seat to edit its position</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Seat: {selectedSeat.seatId}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='x'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>X Position</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='y'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Y Position</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='w'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Width</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='h'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='r'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rotation (degrees)</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='rx'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rotation Origin X</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormDescription>Optional rotation origin</FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='ry'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rotation Origin Y</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormDescription>Optional rotation origin</FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <div className='flex justify-end space-x-2'>
              <Button
                variant='outline'
                type='button'
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
