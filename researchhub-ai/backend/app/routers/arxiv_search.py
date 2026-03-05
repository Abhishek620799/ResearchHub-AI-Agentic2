import httpx
import xml.etree.ElementTree as ET
from fastapi import APIRouter, Query
from typing import List
from pydantic import BaseModel

router = APIRouter(prefix="/arxiv", tags=["arxiv"])

class ArxivPaper(BaseModel):
    arxiv_id: str
    title: str
    abstract: str
    authors: str
    published: str
    url: str

@router.get("/search", response_model=List[ArxivPaper])
def search_arxiv(q: str = Query(..., description="Search query"), max_results: int = 10):
    url = "http://export.arxiv.org/api/query"
    params = {"search_query": f"all:{q}", "max_results": max_results, "sortBy": "relevance"}
    resp = httpx.get(url, params=params, timeout=15)
    resp.raise_for_status()
    ns = {"atom": "http://www.w3.org/2005/Atom"}
    root = ET.fromstring(resp.text)
    results = []
    for entry in root.findall("atom:entry", ns):
        arxiv_id = entry.find("atom:id", ns).text.split("/")[-1]
        title = entry.find("atom:title", ns).text.strip()
        abstract = entry.find("atom:summary", ns).text.strip()
        authors = ", ".join(a.find("atom:name", ns).text for a in entry.findall("atom:author", ns))
        published = entry.find("atom:published", ns).text[:10]
        paper_url = f"https://arxiv.org/abs/{arxiv_id}"
        results.append(ArxivPaper(arxiv_id=arxiv_id, title=title, abstract=abstract, authors=authors, published=published, url=paper_url))
    return results
