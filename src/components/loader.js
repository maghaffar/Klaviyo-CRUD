import * as React from "react";
import { CircularProgress } from "@material-ui/core";
import { Box } from "@material-ui/core";

export default function Loader() {
  return (
    <Box sx={{ display: "flex" }}>
      <CircularProgress />
    </Box>
  );
}
