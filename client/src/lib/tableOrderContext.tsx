import { createContext, useContext, useReducer, ReactNode } from "react";
import { MenuItem } from "@shared/schema";

interface TableOrderItem extends MenuItem {
  quantity: number;
}

interface TableOrderState {
  items: TableOrderItem[];
  total: number;
}

type TableOrderAction =
  | { type: "ADD_ITEM"; payload: MenuItem }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "CLEAR_ORDER" };

const TableOrderContext = createContext<{
  state: TableOrderState;
  dispatch: React.Dispatch<TableOrderAction>;
} | null>(null);

function tableOrderReducer(state: TableOrderState, action: TableOrderAction): TableOrderState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: state.total + Number(action.payload.price)
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        total: state.total + Number(action.payload.price)
      };
    }
    case "REMOVE_ITEM":
      const itemToRemove = state.items.find(item => item.id === action.payload);
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        total: state.total - (itemToRemove ? Number(itemToRemove.price) * itemToRemove.quantity : 0)
      };
    case "UPDATE_QUANTITY": {
      const item = state.items.find(i => i.id === action.payload.id);
      if (!item) return state;

      const quantityDiff = action.payload.quantity - item.quantity;
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.total + (Number(item.price) * quantityDiff)
      };
    }
    case "CLEAR_ORDER":
      return {
        items: [],
        total: 0
      };
    default:
      return state;
  }
}

export function TableOrderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(tableOrderReducer, {
    items: [],
    total: 0
  });

  return (
    <TableOrderContext.Provider value={{ state, dispatch }}>
      {children}
    </TableOrderContext.Provider>
  );
}

export function useTableOrder() {
  const context = useContext(TableOrderContext);
  if (!context) {
    throw new Error("useTableOrder must be used within a TableOrderProvider");
  }
  return context;
}