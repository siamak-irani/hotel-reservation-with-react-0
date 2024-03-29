import { useEffect, useState } from "react";
import { createContext } from "react";
import items from "../../data/data";
import { Room } from "../../lib/type";
import { formatData } from "../../uitls/functions";

export type StoreContext = {
  loading: boolean;
  featuredRooms: Room[];
  rooms: Room[];
  sortedRooms: Room[];
  price: number;
  maxPrice: number;
  maxSize: number;
  type: string;
  capacity: number;
  minPrice: number;
  minSize: number;
  breakfast: boolean;
  pets: boolean;
  handleChange?: (
    event:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>
  ) => void;
  getRoom: (slug: string | undefined) => Room | undefined;
};

const Store = createContext({} as StoreContext);

type StoreContextProviderProps = {
  children: React.ReactNode;
};

export const StoreContextProvider = ({
  children,
}: StoreContextProviderProps) => {
  const rooms: Room[] = formatData(items);
  const featuredRooms = rooms.filter((room: Room) => room.featured === true);

  const maxRoomPrice = Math.max(...rooms.map((item) => item.price));
  const maxRoomSize = Math.max(...rooms.map((item) => item.size));

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>
  ) => {
    const target = event.target;
    const value =
      target.type === "checkbox"
        ? (target as HTMLInputElement).checked
        : target.value;
    const name = target.name;

    setState((prevState: StoreContext) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const getRoom = (slug: string | undefined): Room | undefined => {
    let tempRooms = [...rooms];
    const room = tempRooms.find((room) => room.slug === slug);
    return room;
  };

  const [state, setState] = useState<StoreContext>({
    loading: true,
    featuredRooms: [],
    rooms: [],
    sortedRooms: [],
    price: 0,
    maxPrice: 0,
    maxSize: 0,
    type: "all",
    capacity: 1,
    minPrice: 0,
    minSize: 0,
    breakfast: false,
    pets: false,
    handleChange,
    getRoom,
  });

  useEffect(() => {
    setState((prev) => {
      return {
        ...prev,
        rooms,
        sortedRooms: rooms,
        featuredRooms,
        loading: false,
        price: maxRoomPrice,
        maxPrice: maxRoomPrice,
        maxSize: maxRoomSize,
      };
    });
  }, []);

  const { type, capacity, price, minSize, maxSize, breakfast, pets } = state;

  useEffect(() => {
    filterRooms();
  }, [type, capacity, price, minSize, maxSize, breakfast, pets]);

  const filterRooms = () => {
    let { rooms, type, capacity, price, minSize, maxSize, breakfast, pets } =
      state;

    let tempRooms = [...rooms];
    // capacity = parseInt(capacity);
    // price = parseInt(price);

    if (type !== "all") {
      tempRooms = tempRooms.filter((room) => room.type === type);
    }
    if (capacity !== 1) {
      tempRooms = tempRooms.filter((room) => room.capacity >= capacity);
    }
    tempRooms = tempRooms.filter((room) => room.price <= price);
    tempRooms = tempRooms.filter(
      (room) => room.size >= minSize && room.size <= maxSize
    );
    if (breakfast) {
      tempRooms = tempRooms.filter((room) => room.breakfast === true);
    }
    if (pets) {
      tempRooms = tempRooms.filter((room) => room.pets === true);
    }

    setState((prevState) => ({
      ...prevState,
      sortedRooms: tempRooms,
    }));
  };

  return <Store.Provider value={state}>{children}</Store.Provider>;
};

export default Store;
