import { Button, CircularProgress } from "@material-ui/core";

const BaseButton = ({ loading, label, ...rest }) => {
  return (
    <Button
      disabled={loading}
      startIcon={loading && <CircularProgress size={24} color="inherit" />}
      type="submit"
      fullWidth
      variant="contained"
      color="primary"
      {...rest}
    >
      {label}
    </Button>
  );
};

export default BaseButton;
