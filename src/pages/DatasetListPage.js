import React, { useEffect, useState } from 'react'
import PageHeader from '@atlaskit/page-header'
import { Link } from 'react-router-dom'
import { BreadcrumbsStateless, BreadcrumbsItem } from '@atlaskit/breadcrumbs'
import { api } from '../api'
import { bool, groupBy, items, nth } from '../utils/functional'

export default props => {
  const prefixRe = props.prefix ? new RegExp('^' + props.prefix) : null

  const [allDatasets, setAllDatasets] = useState([])
  const [filteredDatasets, setFilteredDatasets] = useState([])
  const [groupedDatasets, setGroupedDatasets] = useState([])

  useEffect(() => {
    // This normalizes the datasets from the data format into the format
    // required by the view.
    api.listDatasets().then(_ =>
      setAllDatasets(
        Object.entries(_ || {}).map(kv => {
          const [k, v] = kv
          const qualifiedName =
                        (v && v.definition && v.definition.identification) || k
          const description =
                        (v && v.definition && v.definition.description) || null
          const path = qualifiedName.split('.')
          const name = nth(path, -1)
          const group = path[0] || ''
          return {
            id: k,
            name: name,
            description: description,
            qualifiedName: qualifiedName,
            group: group,
            value: v
          }
        })
      )
    )
  }, [])

  useEffect(
    _ => {
      setFilteredDatasets(
        props.prefix
          ? allDatasets.filter(_ => prefixRe.test(_.id))
          : allDatasets
      )
    },
    [allDatasets, props.prefix]
  )

  useEffect(() => {
    setGroupedDatasets(
      items(groupBy(filteredDatasets, _ => (_ ? _.group : '')))
    )
  }, [filteredDatasets])

  const breadcrumbs = props.prefix ? (
    <BreadcrumbsStateless>
      <BreadcrumbsItem
        text='All datasets'
        href={`#${api.linkToDatasets()}`}
        key='0'
      />
      <BreadcrumbsItem
        text={props.prefix}
        href={`#${api.linkToDatasets(props.prefix)}`}
        key='1'
      />
    </BreadcrumbsStateless>
  ) : null

  const renderList = l => (
    <ul className='DatasetList'>
      {(l || []).map((d, i) =>
        d ? (
          <li
            className='DatasetItem'
            key={d.id}
            data-metadata={bool(d.value)}
          >
            <Link
              className='DatasetItem-link'
              to={api.linkToDataset(d.id)}
            >
              <div className='DatasetItem-label'>
                {d.qualifiedName}
              </div>
              <div className='DatasetItem-description'>
                {d.description}
              </div>
            </Link>
          </li>
        ) : null
      )}
    </ul>
  )

  const renderGroup = group => (
    <li key={group[0] || '*'} className='DatasetGroup'>
      {group[0] ? (
        <Link className='DatasetGroup-label' to={api.linkToDatasets(group[0])}>
          {group[0]}
        </Link>
      ) : null}
      {renderList(group[1])}
    </li>
  )

  return (
    <div className='DatasetListPage'>
      <PageHeader breadcrumbs={breadcrumbs}>Data Catalogue</PageHeader>
      {groupedDatasets.length <= 1 ? (
        renderList(filteredDatasets)
      ) : (
        <ul className='DatasetGroup-list'>
          {groupedDatasets.map(renderGroup)}
        </ul>
      )}
    </div>
  )
}
