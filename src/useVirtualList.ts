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
  height: number
}

export default function useVirtualList ({
  count,
  overscan = OVER_SCAN,
  gap = 0,
}: VirtualListProps) {
  const [container, setContainer] = useState<ContainerType>({
    _ref: null,
    height: 0,
  })
  const containerRef = useCallback((node: Element | null | undefined) => {
    if (node) {
      setContainer({
        height: node.getBoundingClientRect().height,
        _ref: node,
      })
    }
  }, [])
  const [virtualFrontSpace, setVirtualFrontSpace] = useState<Element | null>(null)
  const [virtualBackSpace, setVirtualBackSpace] = useState<Element | null>(null)
  const virtualFrontSpaceRef = useCallback((node: Element | null | undefined) => {
    if (node) {
      setVirtualFrontSpace(node)
      ;(node as HTMLElement).style.flexShrink = '0'
    }
  }, [])
  const virtualBackSpaceRef = useCallback((node: Element | null | undefined) => {
    if (node) {
      setVirtualBackSpace(node)
      ;(node as HTMLElement).style.flexShrink = '0'
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

    const index = Number((node as HTMLElement).dataset.key)
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
      const start = measuredItems.slice(0, index).reduce((acc, item) => acc + item.size + gap, 0)
      const end = start + item.size

      return {
        ...item,
        start,
        end,
      }
    })

    setItems(newItems)
  }, [measuredItems, gap])

  useEffect(function calculateTotalHeight () {
    setTotalHeight(items.reduce((acc, item) => acc + item.size + gap, -gap))
  }, [items, gap])

  useEffect(function updateVirtualItems () {
    const handleScroll = () => {
      if (!container._ref) return
      const offset = (container._ref as HTMLElement).scrollTop
      const start = Math.max(0, offset)
      const end = offset + container.height

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
    container._ref?.addEventListener('scroll', handleScroll)
    return () => {
      container._ref?.removeEventListener('scroll', handleScroll)
    }
  }, [items, count, overscan, container])

  const updateVirtualSpace = useCallback(() => {
    if (virtualItems.length === count) return
    if (!container._ref || !virtualFrontSpace || !virtualBackSpace) return

    if (virtualItems[0] && virtualItems[0]._ref) {
      const virtualFrontSpaceEl = virtualFrontSpace as HTMLElement
      const isFirst = virtualItems[0].index === 0
      virtualFrontSpaceEl.style.height = isFirst ? `0px` : `${virtualItems[0].start}px`
      virtualFrontSpaceEl.style.display = isFirst ? 'none' : 'block'
    }

    if (virtualItems[virtualItems.length - 1] && virtualItems[virtualItems.length - 1]._ref) {
      const virtualBackSpaceEl = virtualBackSpace as HTMLElement
      const isLast = virtualItems[virtualItems.length - 1].index === count - 1
      virtualBackSpaceEl.style.height = isLast ? `0px` : `${totalHeight - virtualItems[virtualItems.length - 1].end}px`
      virtualBackSpaceEl.style.display = isLast ? 'none' : 'block'
    }
  }, [virtualItems, count, totalHeight, container, virtualFrontSpace, virtualBackSpace])

  useEffect(function updateVirtualSpaceEffect () {
    updateVirtualSpace()
  }, [updateVirtualSpace])

  const findItem = (condition: (item: VirtualListItem) => boolean) => {
    return items.find(condition)
  }

  const updateVirtualItems = (start: number) => {
    const end = start + container.height

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

    container._ref?.scrollTo({
      top: target.start,
      behavior: 'instant',
    })
  }

  return {
    containerRef,
    virtualFrontSpaceRef,
    virtualBackSpaceRef,
    measureElement,
    totalHeight,
    virtualItems: virtualItems.length === 0 ? items : virtualItems,
    moveTo,
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
