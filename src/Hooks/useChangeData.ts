/* eslint-disable react-hooks/exhaustive-deps */
import { has, isArray, isEmpty, isEqual } from 'lodash';
import { useEffect } from 'react';
import { useWatch } from 'react-hook-form';

interface Props {
  control: any;
  cb?: (params?: any) => void;
  deps: any;
  reset?: (params?: any) => void;
}
export default function useChangeData({ control, deps, cb, reset }: Props) {
  const valuessss = useWatch({ control });
  const isAbc: boolean[] = [];
  const changeStatus: any = {};
  useEffect(() => {
    if (!isEmpty(valuessss)) {
      Object.keys(valuessss).forEach((key: any) => {
        if (!!has(deps, key)) {
          if (!isArray(valuessss[key])) {
            if (!isEqual((valuessss as any)[key], deps[key])) {
              isAbc.push(false);
              changeStatus[key] = true;
            } else {
              isAbc.push(true);
              changeStatus[key] = false;
            }
          } else {
            const newArr = valuessss[key].sort();
            const prevArr = deps[key].sort();
            if (!isEqual(newArr, prevArr)) {
              isAbc.push(false);
              changeStatus[key] = true;
            } else {
              isAbc.push(true);
              changeStatus[key] = false;
            }
          }
        }
      });
      const hasChanged = isAbc.includes(false);
      hasChanged ? cb?.(changeStatus) : reset?.(changeStatus);
    }
  }, [valuessss, deps]);
}
