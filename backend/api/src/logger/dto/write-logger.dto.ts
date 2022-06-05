type Cause = 'Error' | 'Warning' | 'Info';

export class WriteLoggerDto {
  title: string;
  message: string;
  cause: Cause;
}
