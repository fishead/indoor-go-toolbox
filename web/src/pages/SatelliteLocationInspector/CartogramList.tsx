import React, {
  FC,
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback
} from "react";
import {
  List,
  ListItemText,
  ListItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  DialogContentText,
  TextField
} from "@material-ui/core";
import JCMapLogin from "./JCMapLogin";
import { AppContext } from "../../AppContext";
import { stringify as qsStringify } from "qs";
import { BehaviorSubject, EMPTY, from } from "rxjs";
import {
  distinct,
  debounceTime,
  switchMap,
  finalize,
  tap
} from "rxjs/operators";

interface Props {
  onClose: () => void;
  onSelect: (cartogramId: string) => void;
}

export const CartogramList: FC<Props> = props => {
  const [cartograms, setCartogramList] = useState<
    { id: string; name: string }[]
  >([]);
  const { jcmapToken } = useContext(AppContext);
  const [loginVisiable, setLoginVisiable] = useState(!jcmapToken);
  const [cartogramLoading, setCartogramLoading] = useState(false);

  const searchCartogramsSubject = useMemo(
    () => new BehaviorSubject<string | null>(null),
    []
  );

  const handleLoginClose = useCallback(() => {
    setLoginVisiable(false);
    if (!jcmapToken) {
      props.onClose();
    }
  }, [jcmapToken, props]);

  useEffect(() => {
    let unmounted = false;

    const task = searchCartogramsSubject
      .pipe(
        distinct(),
        debounceTime(200),
        switchMap(name => {
          if (unmounted || !jcmapToken) {
            return EMPTY;
          }

          setCartogramLoading(true);
          const query: { [key: string]: any } = {
            limit: 100,
            skip: 0,
            sorters: [
              {
                field: "created_at",
                order: "descend"
              }
            ]
          };
          if (name) {
            query.filters = {
              name: [name]
            };
          }

          return from(
            fetch(
              `https://jcmap.jcbel.com/staging/apis/cartograms?${qsStringify(
                query
              )}`,
              {
                headers: {
                  authorization: "Bearer " + jcmapToken
                }
              }
            )
          ).pipe(
            switchMap(res => res.json()),
            tap(body => {
              if (!unmounted) {
                setCartogramList(body.payload);
              }
            }),
            finalize(() => {
              if (!unmounted) {
                setCartogramLoading(false);
              }
            })
          );
        })
      )
      .subscribe();
    return () => {
      unmounted = true;
      task.unsubscribe();
    };
  }, [jcmapToken, searchCartogramsSubject]);

  if (loginVisiable) {
    return (
      <JCMapLogin
        onClose={() => handleLoginClose()}
        onSuccess={() => setLoginVisiable(false)}
      />
    );
  }

  return (
    <Dialog open={true} onClose={props.onClose}>
      <DialogTitle>选择地图</DialogTitle>
      <DialogContent>
        <TextField
          type="search"
          label="搜索地图"
          fullWidth
          onChange={evt => searchCartogramsSubject.next(evt.target.value)}
        />

        {cartogramLoading ? (
          <CircularProgress />
        ) : cartograms.length ? (
          <List>
            {cartograms.map(cartogram => (
              <ListItem key={cartogram.id}>
                <ListItemText onClick={() => props.onSelect(cartogram.id)}>
                  {cartogram.name}
                </ListItemText>
              </ListItem>
            ))}
          </List>
        ) : (
          <DialogContentText>没有数据</DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.onClose()}>取消</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CartogramList;
