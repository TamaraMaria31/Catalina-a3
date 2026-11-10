import { useEffect } from "react";

const SITE_NAME = "Catalina Marriage";

/** Define o título da aba. Sem argumento, usa o slogan da home. */
export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Tudo para o seu grande dia`;
  }, [title]);
}
