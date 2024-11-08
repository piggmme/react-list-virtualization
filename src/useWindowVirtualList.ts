import { useCallback, useEffect, useMemo, useState } from 'react'

const OVER_SCAN = 5

// TODO: index 아니고 고유한 key를 가지도록 수정 필요...
type VirtualListItem = {
  index: number
  size: number
  start: number
  end: number
  _ref?: Element | null
}

type VirtualListProps = {
  count: number
  overscan?: number
  gap?: number
}

type ContainerType = {
  _ref: Element | null
  offset: number
  _virtualFrontSpace: Element | null
  _virtualBackSpace: Element | null
}

const VIRTUAL_FRONT_SPACE_ID = 'virtual-front-space'
const VIRTUAL_BACK_SPACE_ID = 'virtual-back-space'

export default function useWindowVirtualList ({
  count,
  overscan = OVER_SCAN,
  gap = 0,
}: VirtualListProps) {
  const [container, setContainer] = useState<ContainerType>({
    _ref: null,
    offset: 0,
    _virtualFrontSpace: null,
    _virtualBackSpace: null,
  })
  const containerRef = useCallback((node: Element | null | undefined) => {
    if (node) {
      // Create virtual space
      const _virtualFrontSpace = document.querySelector(`#${VIRTUAL_FRONT_SPACE_ID}`) as HTMLElement || document.createElement('div')
      ;(_virtualFrontSpace as HTMLElement).style.flexShrink = '0'
      _virtualFrontSpace.id = VIRTUAL_FRONT_SPACE_ID
      node.parentNode?.insertBefore(_virtualFrontSpace, node)

      const _virtualBackSpace = document.querySelector(`#${VIRTUAL_BACK_SPACE_ID}`) as HTMLElement || document.createElement('div')
      ;(_virtualBackSpace as HTMLElement).style.flexShrink = '0'
      _virtualBackSpace.id = VIRTUAL_BACK_SPACE_ID
      insertAfter(_virtualBackSpace, node)

      setContainer({
        offset: getOffsetTop(node),
        _ref: node,
        _virtualFrontSpace,
        _virtualBackSpace,
      })
    }
  }, [])

  const [totalHeight, setTotalHeight] = useState(0)
  const defaultItems = useMemo(() => Array.from({ length: count }, (_, i) => ({
    index: i,
    size: 0,
    start: 0,
    end: 0,
    _ref: null,
  })), [count])
  const [items, setItems] = useState<VirtualListItem[]>(defaultItems)
  const [virtualItems, setVirtualItems] = useState<VirtualListItem[]>(defaultItems)

  const measureElement = useCallback((node: Element | null | undefined) => {
    if (!node) return
    const index = Number((node as HTMLElement).dataset.key)

    setItems((prevItems) => {
      const size = node.getBoundingClientRect().height
      const start = index === 0 ? container.offset : prevItems[index - 1].end + gap
      const end = start + size
      const _ref = node

      const newItems = prevItems.map((item, i) => {
        if (i === index) return {
          index, size, start, end, _ref,
        }
        else return item
      })

      setTotalHeight(newItems.reduce((acc, item) => acc + item.size + gap, -gap))
      return newItems
    })
  }, [container.offset, gap])

  useEffect(function updateVirtualItems () {
    const handleScroll = () => {
      const offset = window.scrollY
      const start = Math.max(0, offset)
      const end = offset + window.innerHeight

      const newVirtualItems = items.filter((item) => {
        return item.end > start && item.start < end
      })

      if (newVirtualItems.length === 0) return

      const overScanedVirtualItems = items.slice(
        Math.max(0, newVirtualItems[0].index - overscan),
        Math.min(count, newVirtualItems[newVirtualItems.length - 1].index + 1 + overscan),
      )

      setVirtualItems(overScanedVirtualItems)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [items, count, overscan])

  useEffect(function updateVirtualSpace () {
    if (virtualItems.length === count) return
    if (!container._ref || !container._virtualFrontSpace || !container._virtualFrontSpace) return

    if (virtualItems[0]) {
      const virtualFrontSpace = container._virtualFrontSpace as HTMLElement
      const isFirst = virtualItems[0].index === 0
      virtualFrontSpace.style.height = isFirst ? `0px` : `${virtualItems[0].start}px`
    }

    if (virtualItems[virtualItems.length - 1]) {
      const virtualBackSpace = container._virtualBackSpace as HTMLElement
      const isLast = virtualItems[virtualItems.length - 1].index === count - 1
      virtualBackSpace.style.height = isLast ? `0px` : `${totalHeight - virtualItems[virtualItems.length - 1].end}px`
    }
  }, [virtualItems, count, totalHeight, container])

  return {
    containerRef,
    measureElement,
    totalHeight,
    virtualItems,
  }
}

function getOffsetTop (element: Element | null) {
  if (!element) return 0
  const rect = element.getBoundingClientRect()

  const absoluteTop = rect.top + window.scrollY
  return absoluteTop
}

function insertAfter (newElement: Element, referenceElement: Element) {
  // referenceElement의 다음 형제를 찾음
  const parent = referenceElement.parentNode
  const nextSibling = referenceElement.nextSibling

  // 다음 형제가 있으면 그 앞에, 없으면 부모의 마지막 자식으로 추가
  if (nextSibling) {
    parent?.insertBefore(newElement, nextSibling)
  } else {
    parent?.appendChild(newElement)
  }
}
