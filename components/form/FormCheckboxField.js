import React from 'react';
import { FormItem, FormLabel } from '../ui/form';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';

export default function FormCheckboxField({ data }) {
  const { label, arr, setFilteredArr } = data;

  const handleChange = (e, value) => {
    if (e) setFilteredArr((p) => [...p, value]);
    else setFilteredArr((p) => p.filter((i) => i !== value));
  };

  return (
    <FormItem>
      <FormLabel>
        {label} <span className="text-primary-500 text-xs font-thin select-none">- Optional</span>
      </FormLabel>
      <div className="flex flex-col gap-3">
        {arr.map((item, i) => {
          return (
            <div key={i} className="flex items-center gap-1">
              <Checkbox id={item} onCheckedChange={(e) => handleChange(e, item)} />
              <Label className="font-normal" htmlFor={item}>
                {item}
              </Label>
            </div>
          );
        })}
      </div>
    </FormItem>
  );
}
