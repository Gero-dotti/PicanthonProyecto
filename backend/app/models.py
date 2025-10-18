from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID
from datetime import datetime


# --- Busquedas Models ---
class BusquedaCreate(BaseModel):
    """Schema for creating a new search request"""
    prompt: str = Field(..., description="User's search prompt describing what they want")
    metadata: Optional[dict] = Field(None, description="Additional search context (location, price, bedrooms, etc.)")


class BusquedaResponse(BaseModel):
    """Schema for search response from database"""
    id: UUID = Field(..., description="Unique identifier for the search")
    prompt: str = Field(..., description="User's search prompt")
    metadata: Optional[dict] = Field(None, description="Additional search context")
    created_at: Optional[datetime] = Field(None, description="Timestamp when search was created")

    class Config:
        from_attributes = True


# --- Listings Models ---
class ListingCreate(BaseModel):
    """Schema for creating a new listing"""
    id_busquedas: UUID = Field(..., description="Foreign key reference to the search that generated this listing")
    link: str = Field(..., description="URL to the property listing")
    metadata: Optional[dict] = Field(None, description="Property attributes (price, zone, bedrooms, etc.)")


class ListingResponse(BaseModel):
    """Schema for listing response from database"""
    id: UUID = Field(..., description="Unique identifier for the listing")
    id_busquedas: UUID = Field(..., description="Foreign key reference to parent search")
    link: str = Field(..., description="URL to the property listing")
    metadata: Optional[dict] = Field(None, description="Property attributes")
    created_at: Optional[datetime] = Field(None, description="Timestamp when listing was created")

    class Config:
        from_attributes = True


# --- Combined Models ---
class SearchWithListings(BaseModel):
    """Schema for search with all related listings"""
    search: BusquedaResponse = Field(..., description="The search request details")
    listings: List[ListingResponse] = Field(default_factory=list, description="All property listings found for this search")
