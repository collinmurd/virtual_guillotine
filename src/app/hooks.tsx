import { usePathname } from "next/navigation";
import config from "../../next.config.mjs";

export function usePathnameWithBasepath() {
  const pathName = usePathname();

  if (config.basePath) {
    return config.basePath + pathName;
  } else {
    return pathName;
  }
}