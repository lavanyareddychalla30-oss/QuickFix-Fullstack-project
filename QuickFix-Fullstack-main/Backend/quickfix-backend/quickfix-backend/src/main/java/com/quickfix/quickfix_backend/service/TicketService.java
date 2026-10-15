
package com.quickfix.quickfix_backend.service;

import com.quickfix.quickfix_backend.entity.Ticket;
import com.quickfix.quickfix_backend.repository.TicketRepository;

import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class TicketService {

    private final TicketRepository repository;

    public TicketService(TicketRepository repository) {
        this.repository = repository;
    }

    // Get all tickets
    public List<Ticket> getAllTickets() {
        return repository.findAll();
    }

    // Get tickets belonging to a requester
    public List<Ticket> getMyTickets(String requesterId) {
        return repository.findByRequesterId(requesterId);
    }

    // Get one ticket using its numeric database ID
    public Ticket getTicket(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Ticket not found"
                        )
                );
    }

    // Create ticket
    public Ticket createTicket(Ticket ticket) {
        ticket.setId(null);
        ticket.setCreatedAt(null);
        ticket.setUpdatedAt(null);
        ticket.setResolvedAt(null);

        if (ticket.getTitle() == null ||
                ticket.getTitle().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Title is required"
            );
        }

        if (ticket.getStatus() == null ||
                ticket.getStatus().isBlank()) {
            ticket.setStatus("New");
        }

        if (ticket.getPriority() == null ||
                ticket.getPriority().isBlank()) {
            ticket.setPriority("Medium");
        }

        return repository.save(ticket);
    }

    // Update ticket
    public Ticket updateTicket(Long id, Ticket input) {
        Ticket existing = getTicket(id);

        if (input.getTitle() != null &&
                !input.getTitle().isBlank()) {
            existing.setTitle(input.getTitle());
        }

        if (input.getDescription() != null) {
            existing.setDescription(input.getDescription());
        }

        if (input.getCategory() != null) {
            existing.setCategory(input.getCategory());
        }

        if (input.getPriority() != null) {
            existing.setPriority(input.getPriority());
        }

        if (input.getStatus() != null) {
            existing.setStatus(input.getStatus());

            if ("Resolved".equals(input.getStatus())
                    && existing.getResolvedAt() == null) {
                existing.setResolvedAt(
                        System.currentTimeMillis()
                );
            }

            if (!"Resolved".equals(input.getStatus())) {
                existing.setResolvedAt(null);
            }
        }

        if (input.getAssigneeId() != null) {
            existing.setAssigneeId(input.getAssigneeId());
        }

        return repository.save(existing);
    }

    // Delete ticket
    public void deleteTicket(Long id) {
        Ticket ticket = getTicket(id);
        repository.delete(ticket);
    }
}