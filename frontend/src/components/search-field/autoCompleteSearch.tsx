import { AutoComplete, message } from 'antd'
import type { SelectProps } from 'antd/es/select'
import { Http } from 'api/http'
import useRoleNavigate from 'libs/role-navigate'
import { postCount } from 'pages/layout/Header'
import { useEffect, useState } from 'react'
import { useSocket } from 'socket.io'

function AutoSearch() {
  const [suggest, setSuggest] = useState([])
  const [options, setOptions] = useState<SelectProps<object>['options']>([])
  const [numberOfPost, setNumberOfPost] = useState(0)
  const navigate = useRoleNavigate()
  const { appSocket } = useSocket()
  const updateTotalPost = (data:any) => setNumberOfPost(data?.total || 0)

  useEffect(() => {
    appSocket.on('total_post', updateTotalPost)
    return () => {
      appSocket.off('total_post', updateTotalPost)
    }
  }, [updateTotalPost])

  useEffect(() => {
    const getSuggestions = async () =>
      await Http.get('/api/v1/posts/suggest')
        .then(res => {
          setSuggest(res.data.data)
          postCount.updateState({ number: res.data.count })
        })
        .catch(error => message.error('Failed to get suggestions!'))
    getSuggestions()
  }, [numberOfPost])
  const handleClickSearch = (id: string, refresh?: boolean | undefined) => {
    if (refresh === true) {
      window.location.reload()
    }
    navigate(`/post?id=${id}`)
  }

  const searchResult = (query: string) => {
    const searchResults = suggest.filter(
      (s:any) => s?.title?.replaceAll(' ', '').toLowerCase().includes(query.replaceAll(' ', '').toLowerCase()) === true
    )

    return searchResults.map((slug, idx) => {
      const data = `${slug['title']}`
      const check = data.indexOf(query)
      return {
        value: data,
        key: slug['_id'],
        label: (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
            key={slug['_id']}
          >
            <span>
              <a href="" onClick={() => handleClickSearch(slug['_id'])} target="_blank" rel="noopener noreferrer">
                {data.slice(0, check + 20)}...
              </a>
            </span>
            <span>{suggest.length} results </span>
          </div>
        ),
      }
    })
  }

  const handleSearch = (value: string) => {
    setOptions(value ? searchResult(value) : [])
  }

  const onSelect = (key: string) => {
    handleClickSearch(key, true)
  }

  return (
    <>
    <AutoComplete
      dropdownMatchSelectWidth={278}
      style={{
        width: '480px',
        borderRadius: '30px',
      }}
      options={options}
      onSelect={onSelect}
      onSearch={handleSearch}
      placeholder="Search here"
      notFoundContent="Nothing matches"
    >
      </AutoComplete>
    </>
  )
}

export default AutoSearch