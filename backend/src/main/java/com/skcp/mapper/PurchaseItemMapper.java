package com.skcp.mapper;

import com.skcp.dto.request.purchaseitem.PurchaseItemCreateRequest;
import com.skcp.dto.request.purchaseitem.PurchaseItemUpdateRequest;
import com.skcp.dto.response.purchaseitem.PurchaseItemResponse;
import com.skcp.entity.PurchaseItem;

public class PurchaseItemMapper
{

    // ============================================================
    // CREATE REQUEST → ENTITY
    // ============================================================

    public static PurchaseItem toEntity(
            PurchaseItemCreateRequest request
    )
    {
        PurchaseItem purchaseItem =
                new PurchaseItem();


        /*
         * Purchase is NOT mapped here.
         *
         * Purchase entity is retrieved by Service.
         */

        /*
         * RawMaterial is NOT mapped here.
         *
         * RawMaterial entity is retrieved by Service.
         */


        purchaseItem.setQuantity(
                request.getQuantity()
        );


        purchaseItem.setUnit(
                request.getUnit()
        );


        purchaseItem.setUnitPrice(
                request.getUnitPrice()
        );


        /*
         * lineAmount is intentionally NOT mapped.
         *
         * Backend Service calculates:
         *
         * quantity × unitPrice
         */


        purchaseItem.setRemarks(
                request.getRemarks()
        );


        return purchaseItem;
    }


    // ============================================================
    // UPDATE REQUEST → EXISTING ENTITY
    // ============================================================

    public static void updateEntity(
            PurchaseItem purchaseItem,
            PurchaseItemUpdateRequest request
    )
    {

        /*
         * RawMaterial is updated by Service.
         */


        purchaseItem.setQuantity(
                request.getQuantity()
        );


        purchaseItem.setUnit(
                request.getUnit()
        );


        purchaseItem.setUnitPrice(
                request.getUnitPrice()
        );


        /*
         * lineAmount is intentionally NOT mapped.
         *
         * Backend Service recalculates it.
         */


        purchaseItem.setRemarks(
                request.getRemarks()
        );
    }


    // ============================================================
    // ENTITY → RESPONSE DTO
    // ============================================================

    public static PurchaseItemResponse toResponse(
            PurchaseItem purchaseItem
    )
    {
        PurchaseItemResponse response =
                new PurchaseItemResponse();


        // ========================================================
        // PURCHASE ITEM ID
        // ========================================================

        response.setPurchaseItemId(
                purchaseItem.getPurchaseItemId()
        );


        // ========================================================
        // PURCHASE ID
        // ========================================================

        if (purchaseItem.getPurchase() != null)
        {
            response.setPurchaseId(
                    purchaseItem
                            .getPurchase()
                            .getPurchaseId()
            );
        }


        // ========================================================
        // RAW MATERIAL
        // ========================================================

        if (purchaseItem.getRawMaterial() != null)
        {
            response.setRawMaterialId(
                    purchaseItem
                            .getRawMaterial()
                            .getRawMaterialId()
            );


            response.setRawMaterialName(
                    purchaseItem
                            .getRawMaterial()
                            .getMaterialName()
            );
        }


        // ========================================================
        // PURCHASE ITEM DETAILS
        // ========================================================

        response.setQuantity(
                purchaseItem.getQuantity()
        );


        response.setUnit(
                purchaseItem.getUnit()
        );


        response.setUnitPrice(
                purchaseItem.getUnitPrice()
        );


        response.setLineAmount(
                purchaseItem.getLineAmount()
        );


        response.setRemarks(
                purchaseItem.getRemarks()
        );


        // ========================================================
        // RECORD STATUS
        // ========================================================

        response.setStatus(
                purchaseItem.getStatus()
        );


        return response;
    }

}





/*

package com.skcp.mapper;

import com.skcp.dto.request.purchaseitem.PurchaseItemCreateRequest;
import com.skcp.dto.request.purchaseitem.PurchaseItemUpdateRequest;
import com.skcp.dto.response.purchaseitem.PurchaseItemResponse;
import com.skcp.entity.PurchaseItem;

public class PurchaseItemMapper
{

    public static PurchaseItem toEntity(
            PurchaseItemCreateRequest request
    )
    {
        PurchaseItem purchaseItem = new PurchaseItem();

        purchaseItem.setQuantity(
                request.getQuantity()
        );

        purchaseItem.setUnit(
                request.getUnit()
        );

        purchaseItem.setUnitPrice(
                request.getUnitPrice()
        );


        purchaseItem.setRemarks(
                request.getRemarks()
        );

        return purchaseItem;
    }


    public static void updateEntity(
            PurchaseItem purchaseItem,
            PurchaseItemUpdateRequest request
    )
    {
       
        purchaseItem.setQuantity(
                request.getQuantity()
        );

        purchaseItem.setUnit(
                request.getUnit()
        );

        purchaseItem.setUnitPrice(
                request.getUnitPrice()
        );

        

        purchaseItem.setRemarks(
                request.getRemarks()
        );
    }


    public static PurchaseItemResponse toResponse(
            PurchaseItem purchaseItem
    )
    {
        PurchaseItemResponse response =
                new PurchaseItemResponse();

        response.setPurchaseItemId(
                purchaseItem.getPurchaseItemId()
        );

        
        if (purchaseItem.getPurchase() != null)
        {
            response.setPurchaseId(
                    purchaseItem.getPurchase().getPurchaseId()
            );
        }

       

        if (purchaseItem.getRawMaterial() != null)
        {
            response.setRawMaterialId(
                    purchaseItem.getRawMaterial().getRawMaterialId()
            );

            response.setRawMaterialName(
                    purchaseItem.getRawMaterial().getMaterialName()
            );
        }

        response.setQuantity(
                purchaseItem.getQuantity()
        );

        response.setUnit(
                purchaseItem.getUnit()
        );

        response.setUnitPrice(
                purchaseItem.getUnitPrice()
        );

        response.setLineAmount(
                purchaseItem.getLineAmount()
        );

        response.setRemarks(
                purchaseItem.getRemarks()
        );

        

        return response;
    }
}

*/