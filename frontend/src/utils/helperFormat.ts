import { formatDistanceToNowStrict, format } from 'date-fns'

export const filterDuplicates = (originalArr:any, arrToConcat:any) => {
  return arrToConcat.filter((a:any) => !originalArr.find((o:any) => o.id === a.id))
}

export const formatDateAgo = (date:Date) => {
  return formatDistanceToNowStrict(new Date(date))
}

export const formatDayTime = (date:Date) => {
  try {
    return format(new Date(date), "MMM d', ' yy 'at' H':'mm")
  } catch (error) {
    return null
  }
}

export const formatDay = (date:Date) => {
  try {
    return format(new Date(date), "MMM d', 'yyyy'")
  } catch (error) {
    return 'None'
  }
}

export const getErrorMsg = (err:any) => {
  if (err.graphQLErrors[0]?.message) {
    return err.graphQLErrors[0].message
  } else {
    return err?.message
  }
}
