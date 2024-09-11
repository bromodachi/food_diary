interface ErrorDto {
  message: string;
  errorCode: string;
  details?: { message: string }[];
}
