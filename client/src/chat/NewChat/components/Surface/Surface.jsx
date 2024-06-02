
import {
  Box,
  createPolymorphicComponent,
} from '@mantine/core';
import { forwardRef, ReactNode } from 'react';


const Surface = createPolymorphicComponent(
  forwardRef(({ children, ...others }, ref) => (
    <Box component="div" {...others} ref={ref}>
      {children}
    </Box>
  )),
);

export default Surface;
