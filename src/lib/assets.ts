import { sammy } from "@/config/sammy";

export function sammyImage(path: string): string {
  return path.startsWith("/") ? path : `${sammy.assetRoot}/${path}`;
}
