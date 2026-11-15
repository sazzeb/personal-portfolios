import { sammy } from "@/config/sammy";

export function sammyImage(path: string): string {
  return `${sammy.assetRoot}/${path}`;
}
