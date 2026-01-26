import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class EmptyStringToNullPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): any;
    private transformObject;
}
