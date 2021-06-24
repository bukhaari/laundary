import { memo, useState } from "react";
import { BaseCard } from "../../components/common/BaseCard";
import {
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Table,
  Typography,
  Grid,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  TableCell: {
    borderBottom: "0px solid",
  },
}));

function Order() {
  const classes = useStyles();

  const [CartService] = useState([
    { id: 1, service: "washing", item: "SHIRTS", qty: 1, price: 70 },
    { id: 2, service: "Ironing", item: "TROUSER", qty: 4, price: 60 },
    { id: 3, service: "washing", item: "T-SHIRT", qty: 3, price: 40 },
  ]);

  return (
    <BaseCard>
      <Grid container spacing={3}>
        <Grid item md={12}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>QTY</TableCell>
                <TableCell>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {CartService.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className={classes.TableCell}>{c.item}</TableCell>
                  <TableCell className={classes.TableCell}>
                    {c.service}
                  </TableCell>
                  <TableCell className={classes.TableCell}>{c.qty}</TableCell>
                  <TableCell className={classes.TableCell}>{c.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
        <Grid
          item
          md={12}
          style={{
            textAlign: "right",
            marginRight: "50px",
          }}
        >
          <Typography style={{ fontWeight: "bold" }}>
            Total Amount: 150
          </Typography>
        </Grid>
      </Grid>
    </BaseCard>
  );
}

export default memo(Order);
