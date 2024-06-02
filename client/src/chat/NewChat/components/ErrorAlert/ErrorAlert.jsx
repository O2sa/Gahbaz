import { ReactNode } from 'react';
import { Alert } from '@mantine/core';
import { IconBug } from '@tabler/icons-react';


const ErrorAlert = ({ message, ...others }) => {
  const icon = <IconBug size={18} />;
  const { title } = others;

  return (
    <Alert variant="light" color="red" title={title} icon={icon} {...others}>
      {message || ''}
    </Alert>
  );
};

export default ErrorAlert;
