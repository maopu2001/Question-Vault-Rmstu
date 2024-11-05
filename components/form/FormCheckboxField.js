import { useEffect } from 'react';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

export default function FormCheckboxField({ data }) {
  const { label, arr, setFilteredArr } = data;

  const handleChange = (e, value) => {
    if (e) setFilteredArr((p) => [...p, value]);
    else setFilteredArr((p) => p.filter((i) => i !== value));
  };

  return (
    <div>
      <div className="mt-2 flex flex-col gap-3">
        {arr.map((item, i) => {
          return (
            <div key={i} className="flex items-center gap-1">
              <Checkbox id={item} defaultChecked={false} onCheckedChange={(e) => handleChange(e, item)} />
              <Label className="font-normal" htmlFor={item}>
                {item}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
