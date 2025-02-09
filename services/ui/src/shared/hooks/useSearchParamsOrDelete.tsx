import { useSearchParams } from "react-router-dom";

export default function useSearchParamsOrDelete() {
  const [, setSearchParams] = useSearchParams();

  const handleChangeSearchParams = (key: string, value?: string | null) => {
    setSearchParams((params) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      return params;
    });
  };

  return {
    handleChangeSearchParams,
  };
}
