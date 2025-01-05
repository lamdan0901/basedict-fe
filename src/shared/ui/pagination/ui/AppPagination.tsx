import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
  total: number;
  offset: number;
  limit: number;
  onPageChange(i: number): void;
};

/**
 *
 * @param offset the current page, start from 0
 */
export function AppPagination({ total, offset, limit, onPageChange }: Props) {
  const totalPages = Math.ceil(total / limit);
  const canPrev = offset > 1;
  const canNext = offset < totalPages;

  const renderPageLinks = () => {
    const pageLinks = [];

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= offset - 1 && i <= offset + 1)) {
        pageLinks.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => onPageChange(i)}
              isActive={i === offset}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (
        (i === offset - 2 && offset > 3) ||
        (i === offset + 2 && offset < totalPages - 2)
      ) {
        pageLinks.push(
          <PaginationItem key={i}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    return pageLinks;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(offset - 1)}
            className={!canPrev ? "pointer-events-none opacity-50" : undefined}
            aria-disabled={!canPrev}
          />
        </PaginationItem>
        {renderPageLinks()}
        <PaginationItem>
          <PaginationNext
            className={!canNext ? "pointer-events-none opacity-50" : undefined}
            onClick={() => onPageChange(offset + 1)}
            aria-disabled={!canNext}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
