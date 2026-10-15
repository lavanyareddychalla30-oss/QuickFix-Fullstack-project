
package com.quickfix.quickfix_backend.controller;

import com.quickfix.quickfix_backend.entity.Ticket;
import com.quickfix.quickfix_backend.service.TicketService;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:5173")
public class TicketController {

    private final TicketService service;

    public TicketController(TicketService service) {
        this.service = service;
    }

    // 1. Get all tickets
    @GetMapping
    public List<Ticket> getAllTickets() {
        return service.getAllTickets();
    }

    // 2. Get tickets for a specific requester
    @GetMapping("/my")
    public List<Ticket> getMyTickets(
            @RequestParam String requesterId) {
        return service.getMyTickets(requesterId);
    }

    // 3. Get one ticket by numeric database ID
    @GetMapping("/{id}")
    public Ticket getTicket(@PathVariable Long id) {
        return service.getTicket(id);
    }

    // 4. Create ticket
    @PostMapping
    public Ticket createTicket(@RequestBody Ticket ticket) {
        return service.createTicket(ticket);
    }

    // 5. Update ticket
    @PutMapping("/{id}")
    public Ticket updateTicket(
            @PathVariable Long id,
            @RequestBody Ticket ticket) {
        return service.updateTicket(id, ticket);
    }

    // 6. Delete ticket
    @DeleteMapping("/{id}")
    public String deleteTicket(@PathVariable Long id) {
        service.deleteTicket(id);
        return "Ticket deleted successfully";
    }
}

