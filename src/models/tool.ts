import { Schema, z } from 'zod';

type Parameters = z.ZodTypeAny | Schema<any>;
type inferParameters<PARAMETERS extends Parameters> =
  PARAMETERS extends Schema<any>
    ? PARAMETERS['_type']
    : PARAMETERS extends z.ZodTypeAny
    ? z.infer<PARAMETERS>
    : never;

export interface Tool {
  description: string;
  parameters: Parameters;
  execute?: (args: inferParameters<Parameters>) => void;
  name: string;
}
