package com.example.fevbackend.Logic;

import com.example.fevbackend.Data.Repository.*;
import com.example.fevbackend.Logic.DTOs.EmpresaDTO;
import com.example.fevbackend.Logic.DTOs.PuestoCreatDTO;
import com.example.fevbackend.Logic.DTOs.PuestoDTO;
import com.example.fevbackend.Logic.Model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@org.springframework.stereotype.Repository("Service")
public class Service implements UserDetailsService {
    //------------------------------------------------------------------------------------------------------------------
    // Singleton
    //------------------------------------------------------------------------------------------------------------------
    private static Service instance;

    public static Service getInstance()
    {
        if (instance == null)
        {
            instance = new Service();
        }
        return instance;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Atributos
    //------------------------------------------------------------------------------------------------------------------
    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private FeriaEmpresaRepository feriaEmpresaRepository;

    @Autowired
    private FeriaRepository feriaRepository;

    @Autowired
    private PuestoRepository puestoRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RolesRepository rolesRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    //------------------------------------------------------------------------------------------------------------------
    // Constructor
    //------------------------------------------------------------------------------------------------------------------
    public Service()
    {
        System.out.println("Service created");
    }

    //------------------------------------------------------------------------------------------------------------------
    // Empresa
    //------------------------------------------------------------------------------------------------------------------
    public List<Empresa> getEmpresas()
    {
        return empresaRepository.findAll();
    }

    public Empresa getEmpresa(Integer id)
    {
        return empresaRepository.findById(id).orElse(null);
    }

    public Integer getEmpresaIdByCorreo(String correo) {
        Optional<Empresa> empresa = empresaRepository.findEmpresaByCorreo(correo);

        return empresa.map(Empresa::getId).orElse(null);
    }

    @Transactional
    public Empresa addEmpresa(Empresa empresa) {


        return empresaRepository.save(empresa);
    }

    @Transactional
    public Empresa updateEmpresa(Integer id, EmpresaDTO empresaDTO) {
        Empresa empresa = empresaRepository.findById(id).orElseThrow(() -> new RuntimeException("Empresa no encontrada con ID: " + id));

        // Actualiza los campos de la empresa existente
        empresa.setCedula(empresaDTO.getCedula());
        empresa.setNombre(empresaDTO.getNombre());
        empresa.setDescripcion(empresaDTO.getDescripcion());
        empresa.setCorreo(empresaDTO.getCorreo());
        empresa.setCodigoPais1(empresaDTO.getCodigoPais1());
        empresa.setCodigoPais2(empresaDTO.getCodigoPais2());
        empresa.setTelefono1(empresaDTO.getTelefono1());
        empresa.setTelefono2(empresaDTO.getTelefono2());
        empresa.setWeb(empresaDTO.getWeb());

        // Convertir la imagen de base64 a byte[]
        if (empresaDTO.getImagen() != null && !empresaDTO.getImagen().isEmpty()) {
            // Si es una nueva imagen en base64 (comienza con "data:image/")
            if (empresaDTO.getImagen().startsWith("data:")) {
                String base64Image = empresaDTO.getImagen().split(",")[1];
                empresa.setImagen(Base64.getDecoder().decode(base64Image));
                empresa.setImagenTipo(empresaDTO.getImagenTipo());
            }
        }

        return empresaRepository.save(empresa);
    }

    @Transactional
    public void deleteEmpresa(Integer id) {
        Empresa empresa = empresaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada con ID: " + id));

        empresaRepository.delete(empresa);
    }

    public boolean existsEmpresa(Integer id) {
        return !empresaRepository.existsById(id);
    }

    public boolean existsByNombreOrCedula(String nombre, String cedula) {
        return empresaRepository.existsByNombreOrCedula(nombre, cedula);
    }

    //------------------------------------------------------------------------------------------------------------------
    // FeriaEmpresa
    //------------------------------------------------------------------------------------------------------------------
    @Transactional
    public FeriaEmpresa asociarEmpresaAFeria(Feria feria, Empresa empresa) {
        FeriaEmpresa feriaEmpresa = new FeriaEmpresa();
        feriaEmpresa.setFeria(feria);
        feriaEmpresa.setEmpresa(empresa);
        return feriaEmpresaRepository.save(feriaEmpresa);
    }

    //------------------------------------------------------------------------------------------------------------------
    // Feria
    //------------------------------------------------------------------------------------------------------------------
    public List<Feria> getFerias() {
        return feriaRepository.findAll();
    }

    public Feria getFeria(Integer id) {return feriaRepository.findById(id).orElse(null);}

    @Transactional
    public Feria addFeria(Feria feria) {
        return feriaRepository.save(feria);
    }

    @Transactional
    public Feria updateFeria(Integer id, Feria feriaActualizada) {
        Feria feriaExistente = feriaRepository.findById(id).orElseThrow(() -> new RuntimeException("Feria no encontrada con ID: " + id));

        feriaExistente.setNombre(feriaActualizada.getNombre());
        feriaExistente.setInicio(feriaActualizada.getInicio());
        feriaExistente.setFin(feriaActualizada.getFin());
        feriaExistente.setEstado(feriaActualizada.getEstado());

        return feriaExistente;
    }

    public boolean existsFeria(Integer id) {
        return !feriaRepository.existsById(id);
    }

    @Transactional
    public void deleteFeria(Integer id) {
        Feria feria = feriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feria no encontrada con ID: " + id));

        feriaRepository.delete(feria);
    }

    //------------------------------------------------------------------------------------------------------------------
    // Puesto
    //------------------------------------------------------------------------------------------------------------------
    public List<Puesto> getPuestos() {
        return puestoRepository.findAll();
    }

    public List<Puesto> getPuestosByEmpresaId(Integer empresaId) {
        return puestoRepository.findPuestosByEmpresa_Id(empresaId);
    }

    public Puesto getPuesto(Integer id) {return puestoRepository.findById(id).orElse(null);}

    @Transactional
    public Puesto addPuesto(PuestoCreatDTO puestoDTO){
        // Obtener empresa
        Empresa empresa = empresaRepository.findById(puestoDTO.getEmpresaId())
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada con ID: " + puestoDTO.getEmpresaId()));

        //Mapear del DTO al modelo
        Puesto newPuesto = new Puesto();
        newPuesto.setNombre(puestoDTO.getNombre());
        newPuesto.setDescripcion(puestoDTO.getDescripcion());
        newPuesto.setUrl(puestoDTO.getUrl());
        newPuesto.setEstado(puestoDTO.getEstado());
        newPuesto.setEmpresa(empresa);

        // Convertir la imagen de base64 a byte[]
        if (puestoDTO.getImagen() != null && !puestoDTO.getImagen().isEmpty()) {
            // Si la imagen comienza con "data:image/"
            String base64Image = puestoDTO.getImagen();
            if (base64Image.contains(",")) {
                base64Image = base64Image.split(",")[1];
            }

            newPuesto.setImagen(Base64.getDecoder().decode(base64Image));
            newPuesto.setImagenTipo(puestoDTO.getImagenTipo());
        }

        return puestoRepository.save(newPuesto);
    }

    @Transactional
    public Puesto updatePuesto(Integer id, PuestoDTO puestoDTO) {
        Puesto puesto = puestoRepository.findById(id).orElseThrow( () -> new RuntimeException("Puesto no encontrado con ID: " + id));

        puesto.setNombre(puestoDTO.getNombre());
        puesto.setDescripcion(puestoDTO.getDescripcion());
        puesto.setUrl(puestoDTO.getUrl());
        puesto.setEstado(puestoDTO.getEstado());

        // Convertir la imagen de base64 a byte[]
        if (puestoDTO.getImagen() != null && !puestoDTO.getImagen().isEmpty()) {
            // Si es una nueva imagen en base64 (comienza con "data:image/")
            if (puestoDTO.getImagen().startsWith("data:")) {
                String base64Image = puestoDTO.getImagen().split(",")[1];
                puesto.setImagen(Base64.getDecoder().decode(base64Image));
                puesto.setImagenTipo(puestoDTO.getImagenTipo());
            }
        }

        return puestoRepository.save(puesto);
    }

    public boolean existsPuesto(Integer id) {
        return puestoRepository.existsById(id);
    }

    @Transactional
    public void deletePuesto(Integer id) {
        Puesto puesto = puestoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Puesto no encontrada con ID: " + id));

        puestoRepository.delete(puesto);
    }

    //------------------------------------------------------------------------------------------------------------------
    // User
    //------------------------------------------------------------------------------------------------------------------
    @Transactional(readOnly = true)
    public List<User> getUsers() { return userRepository.findAll(); }

    @Transactional(readOnly = true)
    public User getUser(Integer id) { return userRepository.findById(id).orElse(null); }

    @Transactional(readOnly = true)
    public User getUserByUsername(String username) { return userRepository.findByUsername(username).orElse(null); }

    @Transactional
    public User addUser(User user)
    {
        // Encriptar la contraseña
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        Optional<Role> optionalRoleUser = rolesRepository.findByName("ROLE_EMPRESA");
        List<Role> roles = new ArrayList<>();
        optionalRoleUser.ifPresent(roles::add);

        if (user.getIsAdmin())
        {
            Optional<Role> optionalRoleAdmin = rolesRepository.findByName("ROLE_ADMIN");
            optionalRoleAdmin.ifPresent(roles::add);
        }

        user.setRoles(roles);

        return userRepository.save(user);
    }

    public boolean existsUser(Integer id) {
        return !userRepository.existsById(id);
    }

    //------------------------------------------------------------------------------------------------------------------
    // Security
    //------------------------------------------------------------------------------------------------------------------
    //Este metodo se usar al hacer login
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException
    {
        Optional<User> userOptional = userRepository.findByUsername(username);

        if(userOptional.isEmpty())
        {
            throw new UsernameNotFoundException(String.format("Usuario no encontrado %s.", username));
        }

        User user = userOptional.orElseThrow();

        List<GrantedAuthority> authorities = user.getRoles().stream().map(role -> new SimpleGrantedAuthority(role.getName())).collect(Collectors.toList());

        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), user.getEnable(), true, true, true ,authorities);
    }

    //------------------------------------------------------------------------------------------------------------------
    // Role
    //------------------------------------------------------------------------------------------------------------------
    @Transactional(readOnly = true)
    public List<Role> getRoles() { return rolesRepository.findAll(); }

    @Transactional(readOnly = true)
    public Role getRole(Integer id) { return rolesRepository.findById(id).orElse(null); }

    @Transactional
    public Role addRole(Role role) { return rolesRepository.save(role); }
}
