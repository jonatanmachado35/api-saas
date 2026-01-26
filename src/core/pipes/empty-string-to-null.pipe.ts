import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class EmptyStringToNullPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'object' && value !== null) {
      return this.transformObject(value);
    }
    return value;
  }

  private transformObject(obj: any): any {
    const result = { ...obj };
    for (const key in result) {
      if (result[key] === '' || result[key] === null) {
        result[key] = undefined;
      }
    }
    return result;
  }
}
