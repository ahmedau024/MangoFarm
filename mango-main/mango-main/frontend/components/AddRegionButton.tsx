// @ts-nocheck
import React, { useState } from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { number, z } from "zod";
import authorizedRequest from "@/lib/axios/axios";
import { toast } from "sonner";

const validationSchema = z.object({
  regionName: z
    .string()
    .min(1, { message: "Region name is required" })
    .refine((data) => isNaN(Number(data)), {
      message: "Please enter a non-numeric string",
    }),
  numberOfTrees: z
    .number()
    .int({ message: "Number of trees must be an integer" })
    .min(1, { message: "Number of trees is required" }),
  averageMangoPerTree: z
    .number()
    .int({ message: "Average mango per tree must be an integer" })
    .min(1, { message: "Average mango per tree is required" }),
});
export type AddValidationSchema = z.infer<typeof validationSchema>;

const AddRegionButton = ({
  initialState = false,
  onFormSubmit,
  id,
  name,
  numberOfTrees,
  averageMangoPerTree,
  onCancel,
}) => {
  const [showForm, setShowForm] = useState(initialState);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<AddValidationSchema> = (data) => {
    if (onCancel) {
      authorizedRequest
        .patch(`/api/region/${id}`, data)
        .then(() => {
          toast.success("Region updated successfully.");
          onFormSubmit();
          onCancel();
        })
        .catch((error) => toast.error("Error updating region."));
      setShowForm(false);
    } else {
      authorizedRequest
        .post(`api/region`, data)
        .then((response) => {
          toast.success("Region added successfully.");
          onFormSubmit();
        })
        .catch((error) => toast.error("Error adding region."));
      reset();
      setShowForm(false);
    }
  };

  return (
    <div className="mb-4 w-full">
      {!showForm && (
        <button
          className="bg-orange-600 text-white p-2 rounded-md"
          onClick={() => setShowForm(true)}
        >
          Add New Region
        </button>
      )}

      {showForm && (
        <form
          className="w-full flex items-start gap-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-3 flex-1 gap-2 mr-2">
            <div className="justify-self-stretch">
              <input
                {...register("regionName", {
                  required: true,
                })}
                className="p-2 w-full border-b-2 border-black outline-none focus:border-b-2 focus:border-orange-600"
                type="text"
                placeholder="Enter region name"
                defaultValue={name}
              />
              {errors.regionName && (
                <p className="text-[12px] mt-1 text-red-600">
                  {errors.regionName.message}
                </p>
              )}
            </div>
            <div className="">
              <input
                {...register("numberOfTrees", {
                  required: true,
                  valueAsNumber: true,
                })}
                className="p-2 w-full border-b-2 border-black outline-none focus:border-b-2 focus:border-orange-600"
                type="text"
                placeholder="Enter number of trees"
                defaultValue={numberOfTrees}
              />
              {errors.numberOfTrees && (
                <p className="text-[12px] mt-1 text-red-600">
                  {errors.numberOfTrees.message}
                </p>
              )}
            </div>
            <div className="">
              <input
                {...register("averageMangoPerTree", {
                  required: true,
                  valueAsNumber: true,
                })}
                className="p-2 w-full border-b-2 border-black outline-none focus:border-b-2 focus:border-orange-600"
                type="text"
                placeholder="Enter average mangoes per tree"
                defaultValue={averageMangoPerTree}
              />
              {errors.averageMangoPerTree && (
                <p className="text-[12px] mt-1 text-red-600">
                  {errors.averageMangoPerTree.message}
                </p>
              )}
            </div>
          </div>
          <button
            className="bg-orange-600 text-white p-2 rounded-md"
            type="submit"
          >
            {onSubmit ? "Update" : "Add"}
          </button>
          <button
            className="bg-red-600 text-white p-2 rounded-md"
            onClick={() => {
              onCancel();
              setShowForm(false);
              reset();
            }}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default AddRegionButton;
