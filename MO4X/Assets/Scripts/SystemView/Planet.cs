using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;

public class Planet : MonoBehaviour, IPointerDownHandler, IPointerUpHandler
{
    private float timeToLongPress = 0.15f;
    private float timePressed = 0;
    private bool screenPressed;
    private StarResponse star;
    [SerializeField] private OrbitResponse orbit;

    private SystemGenerator systemGenerator;

    private void Awake()
    {
        systemGenerator = FindObjectOfType<SystemGenerator>();
    }

    private void Update()
    {
        if (screenPressed) timePressed += Time.deltaTime;
    }

    public void setReferences (StarResponse star, OrbitResponse orbit)
    {
        this.star = star;
        this.orbit = orbit;
    }

    public void OnPointerDown(PointerEventData eventData)
    {
        screenPressed = true;
    }

    public void OnPointerUp(PointerEventData eventData)
    {
        screenPressed = false;
        if (timePressed < timeToLongPress)
        {
            openPlanetCard();
        }
        timePressed = 0;
    }

    private void openPlanetCard()
    {
        systemGenerator.activatePlanetCard();
        PlanetCardHandler.instance.setOrbit(star, orbit);
    }
}
