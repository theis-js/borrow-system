# How to use Atoms
Atoms are the fundamental building blocks of state management in this system. They represent individual pieces of state that can be shared and manipulated across different components.

You can also name it global state.

## Creating an Atom
to create an atom you have to declare an atom like this:

```ts
import { atom } from 'jotai';

export const NAME_OF_YOUR_ATOM = atom<type_of_your_atom>(initial_value);
```

In this project we declare all atoms in the `states/Atoms.tsx`file. Which you can find above this README file.

## Using an Atom
To use an atom in your component, you can use the `useAtom` hook provided by Jotai. Here's an example of how to use an atom in a React component:

```tsx
import { useAtom } from 'jotai';
import { NAME_OF_YOUR_ATOM } from '@/states/Atoms';

const MyComponent = () => {
  const [value, setValue] = useAtom(NAME_OF_YOUR_ATOM);

  return (
    <div>
      <p>Current value: {value}</p>
      <button onClick={() => setValue(newValue)}>Update Value</button>
    </div>
  );
};
```

As you can see, you can use `useAtom` like `useState` but the state is global. In this example `value` is the current state of the atom, and `setValue` is a function to update the state, which is also known as the setter function.
