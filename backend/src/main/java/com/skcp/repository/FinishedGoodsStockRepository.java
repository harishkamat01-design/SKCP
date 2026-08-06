package com.skcp.repository;

import com.skcp.entity.FinishedGoodsStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FinishedGoodsStockRepository extends JpaRepository<FinishedGoodsStock, Integer> {

}