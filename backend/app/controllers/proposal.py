from app.database.connection import get_database
from app.schemas.proposal import ProposalCreate, ProposalResponse
from datetime import datetime, timezone

async def create_proposal(proposal: ProposalCreate) -> ProposalResponse:
    db = get_database()
    collection = db["proposals"]
    
    # Prepare document
    proposal_dict = proposal.model_dump()
    proposal_dict["created_at"] = datetime.now(timezone.utc)
    
    # Insert into MongoDB
    result = await collection.insert_one(proposal_dict)
    
    # Return response
    proposal_dict["id"] = str(result.inserted_id)
    return ProposalResponse(**proposal_dict)

async def get_all_proposals() -> list[ProposalResponse]:
    db = get_database()
    collection = db["proposals"]
    
    proposals = []
    cursor = collection.find({}).sort("created_at", -1)
    
    async for document in cursor:
        document["id"] = str(document["_id"])
        proposals.append(ProposalResponse(**document))
        
    return proposals
