import {
  useCallback, useEffect, useLayoutEffect, useMemo, useState,
} from 'react'
import { flushSync } from 'react-dom'

const OVER_SCAN = 5

type MeasuredItem = {
  index: number
  size: number
  _ref?: Element | null
}

type VirtualListItem = {
  start: number
  end: number
} & MeasuredItem

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
  const defaultItems = useMemo(() => Array.from({ length: count }, (_, index) => (createVirtualItem(index))), [count])
  const [measuredItems, setMeasuredItems] = useState<MeasuredItem[]>([])
  const [items, setItems] = useState<VirtualListItem[]>([])
  const [virtualItems, setVirtualItems] = useState<VirtualListItem[]>([])

  useLayoutEffect(function updateItems () {
    setItems(defaultItems)
    setMeasuredItems(defaultItems)
    setVirtualItems([])
  }, [defaultItems])

  const measureElement = (node: Element | null | undefined) => {
    if (!node) return

    const index = Number((node as HTMLElement).dataset.index)
    const size = node.getBoundingClientRect().height

    if (measuredItems[index].size === size) return

    setMeasuredItems((prevItems) => {
      const newItems = prevItems.map((item, i) => {
        if (i === index) return {
          index, size, _ref: node,
        }
        else return item
      })

      return newItems
    })
  }

  useEffect(function updateItemsStartEnd () {
    const newItems = measuredItems.map((item, index) => {
      const start = measuredItems.slice(0, index).reduce((acc, item) => acc + item.size + gap, container.offset)
      const end = start + item.size

      return {
        ...item,
        start,
        end,
      }
    })

    setItems(newItems)
  }, [measuredItems, gap, container.offset])

  useEffect(function calculateTotalHeight () {
    setTotalHeight(items.reduce((acc, item) => acc + item.size + gap, -gap))
  }, [items, gap])

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

  const updateVirtualSpace = useCallback(() => {
    if (virtualItems.length === count) return
    if (!container._ref || !container._virtualFrontSpace || !container._virtualFrontSpace) return

    if (virtualItems[0]) {
      const virtualFrontSpace = container._virtualFrontSpace as HTMLElement
      const isFirst = virtualItems[0].index === 0
      virtualFrontSpace.style.height = isFirst ? `0px` : `${virtualItems[0].start}px`
      virtualFrontSpace.style.display = isFirst ? 'none' : 'block'
    }

    if (virtualItems[virtualItems.length - 1]) {
      const virtualBackSpace = container._virtualBackSpace as HTMLElement
      const isLast = virtualItems[virtualItems.length - 1].index === count - 1
      virtualBackSpace.style.height = isLast ? `0px` : `${totalHeight - virtualItems[virtualItems.length - 1].end}px`
      virtualBackSpace.style.display = isLast ? 'none' : 'block'
    }
  }, [virtualItems, count, totalHeight, container])

  useEffect(function updateVirtualSpaceEffect () {
    updateVirtualSpace()
  }, [updateVirtualSpace])

  const findItem = (condition: (item: VirtualListItem) => boolean) => {
    return items.find(condition)
  }

  const updateVirtualItems = (start: number) => {
    const end = start + window.innerHeight

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

  const moveTo = (condition: (item: VirtualListItem) => boolean) => {
    const target = findItem(condition)
    if (!target) return

    flushSync(() => {
      updateVirtualItems(target.start)
      updateVirtualSpace()
    })

    window.scrollTo({
      top: target.start,
      behavior: 'instant',
    })
  }

  return {
    containerRef,
    measureElement,
    totalHeight,
    virtualItems: virtualItems.length === 0 ? items : virtualItems,
    moveTo,
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

function createVirtualItem (index: number) {
  return {
    index,
    size: 0,
    start: 0,
    end: 0,
    _ref: null,
  }
}
