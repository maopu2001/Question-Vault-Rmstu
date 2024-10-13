import { FormField, FormItem, FormLabel, FormMessage, FormControl } from '../ui/form';
import { Input } from '../ui/input';
export default function FormTextField({ formControl, data }) {
  const name = data.name;
  const placeholder = data.placeholder;
  const label = data.label;
  const type = data.type;
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
