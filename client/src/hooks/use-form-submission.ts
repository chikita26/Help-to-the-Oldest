import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";

interface UseFormSubmissionOptions<T> {
  schema: z.ZodSchema<T>;
  apiEndpoint: string;
  successTitle: string;
  successMessage: string;
  errorContext?: string;
  onSuccess?: (data: any) => void;
  defaultValues?: Partial<T>;
}

export function useFormSubmission<T extends Record<string, any>>({
  schema,
  apiEndpoint,
  successTitle,
  successMessage,
  errorContext,
  onSuccess,
  defaultValues,
}: UseFormSubmissionOptions<T>) {
  const { toast } = useToast();
  const { handleApiError } = useErrorHandler();

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any,
  });

  const mutation = useMutation({
    mutationFn: async (data: T) => {
      const response = await apiRequest("POST", apiEndpoint, data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: successTitle,
        description: successMessage,
      });
      form.reset();
      onSuccess?.(data);
    },
    onError: (error: any) => {
      handleApiError(error, errorContext);
    },
  });

  const handleSubmit = (data: T) => {
    mutation.mutate(data);
  };

  return {
    form,
    handleSubmit,
    isSubmitting: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}