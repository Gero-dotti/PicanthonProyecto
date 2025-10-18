from fastapi import APIRouter, HTTPException, status
from typing import List
from uuid import UUID

from app.database import get_supabase_client
from app.models import (
    BusquedaCreate,
    BusquedaResponse,
    ListingCreate,
    ListingResponse,
    SearchWithListings,
)

router = APIRouter()


@router.post("/searches", response_model=BusquedaResponse, status_code=status.HTTP_201_CREATED)
async def create_search(search_data: BusquedaCreate):
    """
    Create a new search request in the Busquedas table.

    Args:
        search_data: Search prompt and optional metadata

    Returns:
        BusquedaResponse: Created search with generated ID

    Raises:
        HTTPException: If database operation fails
    """
    try:
        supabase = get_supabase_client()
        response = supabase.table("Busquedas").insert(search_data.model_dump()).execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create search",
            )

        return BusquedaResponse(**response.data[0])
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.get("/searches/{search_id}", response_model=BusquedaResponse)
async def get_search(search_id: UUID):
    """
    Retrieve a single search by its ID.

    Args:
        search_id: UUID of the search to retrieve

    Returns:
        BusquedaResponse: Search details

    Raises:
        HTTPException: 404 if search not found, 500 on database error
    """
    try:
        supabase = get_supabase_client()
        response = supabase.table("Busquedas").select("*").eq("id", str(search_id)).execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Search with ID {search_id} not found",
            )

        return BusquedaResponse(**response.data[0])
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.get("/searches/{search_id}/listings", response_model=List[ListingResponse])
async def get_listings_for_search(search_id: UUID):
    """
    Retrieve all listings associated with a specific search.

    Args:
        search_id: UUID of the parent search

    Returns:
        List[ListingResponse]: All listings for this search (empty list if none)

    Raises:
        HTTPException: 500 on database error
    """
    try:
        supabase = get_supabase_client()
        response = (
            supabase.table("Listings")
            .select("*")
            .eq("id_busquedas", str(search_id))
            .execute()
        )

        return [ListingResponse(**item) for item in response.data]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.get("/searches/{search_id}/full", response_model=SearchWithListings)
async def get_search_with_listings(search_id: UUID):
    """
    Retrieve a search along with all its related listings in one call.

    Args:
        search_id: UUID of the search

    Returns:
        SearchWithListings: Combined search and listings data

    Raises:
        HTTPException: 404 if search not found, 500 on database error
    """
    # Fetch the search
    search = await get_search(search_id)

    # Fetch all related listings
    listings = await get_listings_for_search(search_id)

    return SearchWithListings(search=search, listings=listings)


@router.post("/listings", response_model=ListingResponse, status_code=status.HTTP_201_CREATED)
async def create_listing(listing_data: ListingCreate):
    """
    Create a new listing in the Listings table.

    Args:
        listing_data: Listing link, parent search ID, and optional metadata

    Returns:
        ListingResponse: Created listing with generated ID

    Raises:
        HTTPException: If database operation fails (including foreign key constraint violations)
    """
    try:
        supabase = get_supabase_client()
        response = supabase.table("Listings").insert(listing_data.model_dump()).execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create listing",
            )

        return ListingResponse(**response.data[0])
    except Exception as e:
        # Foreign key violations or other database errors
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Database error: {str(e)}",
        )


@router.get("/listings/{listing_id}", response_model=ListingResponse)
async def get_listing(listing_id: UUID):
    """
    Retrieve a single listing by its ID.

    Args:
        listing_id: UUID of the listing to retrieve

    Returns:
        ListingResponse: Listing details

    Raises:
        HTTPException: 404 if listing not found, 500 on database error
    """
    try:
        supabase = get_supabase_client()
        response = supabase.table("Listings").select("*").eq("id", str(listing_id)).execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Listing with ID {listing_id} not found",
            )

        return ListingResponse(**response.data[0])
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )
