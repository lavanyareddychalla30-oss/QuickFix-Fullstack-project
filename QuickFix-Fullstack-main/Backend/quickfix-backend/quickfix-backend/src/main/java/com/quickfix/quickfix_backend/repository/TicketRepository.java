package com.quickfix.quickfix_backend.repository;

import com.quickfix.quickfix_backend.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TicketRepository
        extends JpaRepository<Ticket, Long> {

    List<Ticket> findByRequesterId(String requesterId);
}