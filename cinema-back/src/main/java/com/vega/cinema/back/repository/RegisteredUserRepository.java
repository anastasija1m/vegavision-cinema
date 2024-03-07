package com.vega.cinema.back.repository;

import com.vega.cinema.back.model.RegisteredUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegisteredUserRepository extends JpaRepository<RegisteredUser, Long> {

}