import { useIntl } from "react-intl"

export const T = (id) => {
  const intl = useIntl()
  return intl.formatMessage({id: id})
}
