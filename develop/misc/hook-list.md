---
outline: deep
---

# Hooks
This page is a reference of provided hooks you can subscribe to.

::: info
This list may not contain all available hooks or may not be up to date 100%.
:::

To learn about how to work with hooks, please rad [Minigame logic → Hooks](/develop/developing-minigames/minigame-logic#hooks).

Hooks are contributed by several modules.
The tables below are grouped by the module that declares them.

## Reading the tables
- **Hook** is the field you register on, written as `DeclaringType.FIELD`. Register it with
  `DeclaringType.FIELD.registerWith(hooks) { ... }`.
- **Signature** is the single callback method you implement (its parameters and return type).
- The **return type** tells you what you can influence:
  - a `boolean` hook is cancellable. Returning `true` cancels the event most of the time. If several listeners
    are registered, their results are often OR-ed, so any listener can cancel but all can react.
  - different hooks use different mechanisms to influence the result (not every hook works the same)
  - a `void`/`Unit` hook is notify-only.

## arcade-party-2
Events specific to Arcade Party.
Some hooks may be moved to kibu in the future...

### Actors
| Hook                        | Signature                     | Fires when              |
|-----------------------------|-------------------------------|-------------------------|
| `ActorSpawnedCallback.HOOK` | `void onSpawned(Actor actor)` | an ap2 actor is spawned |
| `ActorRemovedCallback.HOOK` | `void onRemoved(Actor actor)` | an ap2 actor is removed |

### Core hooks
| Hook                                     | Signature                                                                                                                                 | Fires when                                                    |
|------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------|
| `AnimalBreedCallback.HOOK`               | `void onBreed(ServerPlayer breeder, Animal parent, Animal partner, AgeableMob child)`                                                     | two animals are bred into a child                             |
| `DamageKnockbackCallback.HOOK`           | `boolean shouldTakeKnockback(LivingEntity affected, DamageSource source, float damage)`                                                   | an entity is about to take knockback from damage              |
| `EntityPathFindingCallback.HOOK`         | `@Nullable Path modifyPath(Entity entity, @Nullable Path original, Set<BlockPos> targets, Function<BlockPos, @Nullable Path> pathFinder)` | an entity computes a navigation path (modify it)              |
| `PlayerListEntriesOnJoinCallback.HOOK`   | `Collection<ServerPlayer> shouldBeSent(Collection<ServerPlayer> players)`                                                                 | player list entries are sent on join (filter recipients)      |
| `ItemCraftedCallback.HOOK`               | `void onCrafted(ServerPlayer player, ItemStack stack, int amount)`                                                                        | a player crafts an item                                       |
| `PlayerEliminatedCallback.HOOK`          | `void onEliminated(ServerPlayer player)`                                                                                                  | a player is eliminated from the game                          |
| `DeathMessageItemCallback.HOOK`          | `ItemStack modifyItem(DamageSource source, LivingEntity killed, ItemStack stack)`                                                         | the item shown in a death message is chosen (modify it)       |
| `EntityAfterMoveCallback.HOOK`           | `void afterMoveTick(Mob entity)`                                                                                                          | after a mob's move tick                                       |
| `SpectatePlayerCallback.HOOK`            | `boolean onSpectate(ServerPlayer spectator, Entity target)`                                                                               | a spectator tries to spectate a target                        |
| `PlayerDisplayNameCallback.HOOK`         | `Component modifyDisplayName(Player player, Component name)`                                                                              | a player's display name is resolved (modify it)               |
| `DripLeafTiltCallback.HOOK`              | `boolean onTilt(Entity entity, BlockPos pos)`                                                                                             | a big dripleaf is about to tilt under an entity               |
| `RangedWeaponUsedCallback.HOOK`          | `void onShot(LivingEntity entity, ItemStack stack, int remainingUseTicks)`                                                                | a ranged weapon (bow/crossbow) is used                        |
| `EnderPearlTeleportCallback.HOOK`        | `boolean onTeleport(Entity owner, ThrownEnderpearl enderPearl, Vec3 pos)`                                                                 | an ender pearl is about to teleport its owner                 |
| `CreakingLookedAtCheckCallback.HOOK`     | `PendingResult<Boolean> isBeingLookedAt(Creaking creaking)`                                                                               | whether a creaking is being looked at is checked              |
| `ExplosionAffectedEntitiesCallback.HOOK` | `List<Entity> overrideAffectedEntities(Explosion explosion, List<Entity> affected)`                                                       | an explosion resolves the entities it affects (override list) |
| `PlayerDeathMessageCallback.HOOK`        | `Component modifyDeathMessage(ServerPlayer player, DamageSource source, Component currentMsg)`                                            | a player's death message is built (modify it)                 |
| `EntitySpawnCallback.HOOK`               | `boolean onSpawn(Entity entity, ServerLevel world)`                                                                                       | an entity is about to spawn in a world                        |
| `ProjectileShootCallback.HOOK`           | `void onShoot(LivingEntity shooter, Projectile projectile)`                                                                               | a living entity shoots a projectile                           |
| `ProjectileHitEntityCallback.HOOK`       | `void onHitEntity(Projectile projectile, EntityHitResult hit)`                                                                            | a projectile hits an entity                                   |
| `PlayerCanTrackCallback.HOOK`            | `boolean canTrack(ServerPlayer player, Entity entity)`                                                                                    | whether a player may track an entity is checked               |
| `CopperGolemTurnIntoStatueCallback.HOOK` | `boolean onTurnIntoStatue(CopperGolem copperGolem)`                                                                                       | a copper golem is about to turn into a statue                 |
| `EntitySpawnedByCallback.HOOK`           | `void onSpawned(ServerLevel level, Entity entity, @Nullable ItemStack stack, @Nullable LivingEntity user, EntitySpawnReason reason)`      | an entity is spawned by an item or user                       |
| `LivingEntityAttributeInitCallback.HOOK` | `void onAttributesInitialized(LivingEntity living)`                                                                                       | a living entity's attributes are initialized                  |
| `EntityPushEntityCallback.HOOK`          | `boolean onPush(Entity pushed, Entity pusher)`                                                                                            | an entity pushes another entity                               |
| `CobwebSlowCallback.HOOK`                | `boolean cancelSlow(Entity entity, BlockPos pos)`                                                                                         | an entity would be slowed by a cobweb (cancel the slow)       |
| `CanShootProjectileCallback.HOOK`        | `boolean canShoot(LivingEntity shooter, ItemStack stack, InteractionHand hand)`                                                           | whether a shooter may shoot a projectile is checked           |
| `FrozenTickChangeCallback.HOOK`          | `boolean onFrozenTicksChange(Entity entity, int ticks)`                                                                                   | an entity's powder-snow freeze ticks change                   |
| `ArmorAbsorbDamageCallback.HOOK`         | `boolean mayAbsorbDamage(LivingEntity victim, DamageSource source, float damage)`                                                         | whether armor may absorb incoming damage is checked           |
| `PowderedSnowSlowCallback.ADD`           | `boolean shouldCancel(LivingEntity entity)`                                                                                               | an entity starts being slowed by powder snow                  |
| `PowderedSnowSlowCallback.REMOVE`        | `boolean shouldCancel(LivingEntity entity)`                                                                                               | an entity stops being slowed by powder snow                   |
| `BrainCreationCallback.Warden.HOOK`      | `@Nullable Brain<Warden> createBrain(Warden entity, Supplier<Brain<Warden>> brainGetter)`                                                 | a warden's brain is created (override it)                     |
| `BrainCreationCallback.Creaking.HOOK`    | `@Nullable Brain<Creaking> createBrain(Creaking entity, Supplier<Brain<Creaking>> brainGetter)`                                           | a creaking's brain is created (override it)                   |

## kibu
kibu is the main event/util library. 
Its hooks live in several submodules.

### kibu-hooks
General server, world, player and entity hooks.

#### Level and blocks
| Hook                                  | Signature                                                                       | Fires when                                             |
|---------------------------------------|---------------------------------------------------------------------------------|--------------------------------------------------------|
| `ServerWorldReadyCallback.HOOK`       | `void onWorldReady(MinecraftServer server)`                                     | a server world becomes ready                           |
| `ServerWorldUnreadyCallback.HOOK`     | `void onWorldUnready(MinecraftServer server)`                                   | a server world becomes unready                         |
| `FarmlandMoistureChangeCallback.HOOK` | `boolean onMoistureChange(ServerLevel world, BlockPos pos, int moisture)`       | farmland moisture is about to change                   |
| `BlockBreakParticleCallback.HOOK`     | `boolean onSpawnParticles(Level world, BlockPos pos, BlockState state)`         | block break particles are about to spawn               |
| `PressurePlateCallback.HOOK`          | `boolean onPress(Level world, BlockPos pos, Entity entity)`                     | an entity presses a pressure plate                     |
| `ItemScatterCallback.HOOK`            | `boolean onScatter(Level world, double x, double y, double z, ItemStack stack)` | an item is scattered into the world (e.g. block drops) |

#### Block modification (`BlockModificationHooks`)
| Hook                                              | Signature                                                                        | Fires when                                       |
|---------------------------------------------------|----------------------------------------------------------------------------------|--------------------------------------------------|
| `BlockModificationHooks.PLACE_BLOCK`              | `boolean onPlace(Level world, BlockPos pos, Entity entity, BlockState newState)` | a block is about to be placed                    |
| `BlockModificationHooks.BLOCK_PLACED`             | `void onModified(Level world, BlockPos pos, Entity entity)`                      | a block has been placed                          |
| `BlockModificationHooks.BREAK_BLOCK`              | `boolean onModify(Level world, BlockPos pos, Entity entity)`                     | a block is about to be broken                    |
| `BlockModificationHooks.BLOCK_BROKEN`             | `void onModified(Level world, BlockPos pos, Entity entity)`                      | a block has been broken                          |
| `BlockModificationHooks.PLACE_FLUID`              | `boolean onTransfer(Level world, BlockPos pos, Entity entity, Fluid fluid)`      | a fluid is about to be placed                    |
| `BlockModificationHooks.PICKUP_FLUID`             | `boolean onTransfer(Level world, BlockPos pos, Entity entity, Fluid fluid)`      | a fluid is about to be picked up                 |
| `BlockModificationHooks.USE_ITEM_ON_BLOCK`        | `InteractionResult onUse(UseOnContext ctx)`                                      | an item is used on a block                       |
| `BlockModificationHooks.TRAMPLE_FARMLAND`         | `boolean onModify(Level world, BlockPos pos, Entity entity)`                     | farmland is about to be trampled                 |
| `BlockModificationHooks.TRAMPLE_TURTLE_EGG`       | `boolean onModify(Level world, BlockPos pos, Entity entity)`                     | a turtle egg is about to be trampled             |
| `BlockModificationHooks.EAT_CAKE`                 | `boolean onModify(Level world, BlockPos pos, Entity entity)`                     | a cake is about to be eaten                      |
| `BlockModificationHooks.CAN_MOB_GRIEF`            | `boolean onModify(Level world, BlockPos pos, Entity entity)`                     | a mob is about to grief a block                  |
| `BlockModificationHooks.EXTINGUISH_CANDLE`        | `boolean onModify(Level world, BlockPos pos, Entity entity)`                     | a candle is about to be extinguished             |
| `BlockModificationHooks.COMPOSTER`                | `boolean onModify(Level world, BlockPos pos, Entity entity)`                     | a composter is about to be used                  |
| `BlockModificationHooks.CHARGE_RESPAWN_ANCHOR`    | `boolean onModify(Level world, BlockPos pos, Entity entity)`                     | a respawn anchor is about to be charged          |
| `BlockModificationHooks.EXPLODE_RESPAWN_LOCATION` | `boolean onModify(Level world, BlockPos pos, Entity entity)`                     | a respawn location is about to explode           |
| `BlockModificationHooks.PRIME_TNT`                | `boolean onModify(Level world, BlockPos pos, Entity entity)`                     | TNT is about to be primed                        |
| `BlockModificationHooks.TAKE_LECTERN_BOOK`        | `boolean onModify(Level world, BlockPos pos, Entity entity)`                     | a lectern book is about to be taken              |
| `BlockModificationHooks.EDIT_SIGN`                | `boolean onModify(Level world, BlockPos pos, Entity entity)`                     | a sign is about to be edited                     |
| `BlockModificationHooks.DECORATIVE_POT_STORE`     | `boolean onModify(Level world, BlockPos pos, Entity entity)`                     | an item is about to be stored in a decorated pot |

#### Level physics (`LevelPhysicsHooks`)
| Hook                                         | Signature                                                                                     | Fires when                                |
|----------------------------------------------|-----------------------------------------------------------------------------------------------|-------------------------------------------|
| `LevelPhysicsHooks.EXPLOSION`                | `boolean onExplode(ServerExplosion explosion)`                                                | an explosion is about to occur            |
| `LevelPhysicsHooks.MELT`                     | `boolean onFade(Level world, BlockPos pos)`                                                   | a block is about to melt                  |
| `LevelPhysicsHooks.FREEZE`                   | `boolean onFade(Level world, BlockPos pos)`                                                   | water is about to freeze                  |
| `LevelPhysicsHooks.CORAL_DEATH`              | `boolean onFade(Level world, BlockPos pos)`                                                   | coral is about to die                     |
| `LevelPhysicsHooks.REPLACE_DISK_ENCHANTMENT` | `boolean onApply(Level world, BlockPos pos, @Nullable LivingEntity entity, BlockState state)` | a frost-walker style disk replaces blocks |
| `LevelPhysicsHooks.SNOW_FALL`                | `boolean onSnowFall(Level world, BlockPos pos)`                                               | snow is about to accumulate               |
| `LevelPhysicsHooks.CAULDRON_PRECIPITATION`   | `boolean onChange(Level world, BlockPos pos, BlockState newState)`                            | a cauldron fills from precipitation       |
| `LevelPhysicsHooks.CAULDRON_DRIP_STONE`      | `boolean onChange(Level world, BlockPos pos, BlockState newState)`                            | a cauldron fills from a dripstone         |
| `LevelPhysicsHooks.BLOCK_ITEM_DROP`          | `boolean onTileDrop(Level world, BlockPos pos, ItemStack stack)`                              | a block drops an item                     |
| `LevelPhysicsHooks.BLOCK_XP_DROP`            | `boolean onTileDropExperience(Level world, BlockPos pos, int xp)`                             | a block drops experience                  |

#### Network
| Hook                             | Signature                                                                                           | Fires when                                         |
|----------------------------------|-----------------------------------------------------------------------------------------------------|----------------------------------------------------|
| `CustomClickActionCallback.HOOK` | `void onCustomClickAction(ServerPlayer player, Identifier id, Optional<Tag> payload)`               | a custom click action is received                  |
| `ServerSendPacketCallback.HOOK`  | `PendingResult<Packet<?>> overridePacket(Packet<?> packet, ServerCommonPacketListenerImpl handler)` | the server is about to send a packet (override it) |

#### Player
| Hook                                    | Signature                                                                                              | Fires when                                       |
|-----------------------------------------|--------------------------------------------------------------------------------------------------------|--------------------------------------------------|
| `PlayerMoveCallback.HOOK`               | `boolean onMove(ServerPlayer player, PositionRotation from, PositionRotation to)`                      | a player changes position                        |
| `PlayerJumpCallback.HOOK`               | `boolean onJump(ServerPlayer player)`                                                                  | a player jumps                                   |
| `PlayerSneakCallback.HOOK`              | `boolean onSneak(ServerPlayer player, boolean sneaking)`                                               | a player toggles sneaking                        |
| `PlayerSprintCallback.HOOK`             | `void onSprint(ServerPlayer player, boolean sprinting)`                                                | a player toggles sprinting                       |
| `PlayerInputCallback.HOOK`              | `void onInput(ServerPlayer player, Input input)`                                                       | a player's movement input changes                |
| `PlayerToggleFlightCallback.HOOK`       | `boolean onToggleFlight(ServerPlayer player, boolean fly)`                                             | a player toggles flight                          |
| `PlayerSwingHandHook.HOOK`              | `void onSwingHand(ServerPlayer player, InteractionHand hand)`                                          | a player swings a hand                           |
| `PlayerDeathCallback.HOOK`              | `void onDeath(ServerPlayer player, DamageSource source)`                                               | a player dies                                    |
| `PlayerTeleportedCallback.HOOK`         | `void onTeleported(ServerPlayer player)`                                                               | a player has been teleported                     |
| `PlayerGameModeChangeCallback.HOOK`     | `void onChangeGameMode(ServerPlayer player, GameType gameMode)`                                        | a player's game mode changes                     |
| `PlayerSpawnLocationCallback.HOOK`      | `void onSpawn(LocationData data)`                                                                      | a player's spawn location is resolved            |
| `PlayerSpawnPointChangeCallback.HOOK`   | `boolean onChange(Player player, Level world, BlockPos pos)`                                           | a player's spawn point is about to change        |
| `PlayerWaypointCallback.HOOK`           | `boolean onRefreshTracking(ServerPlayer player, WaypointTransmitter waypoint)`                         | a player's waypoint tracking refreshes           |
| `PlayerAdvancementPacketCallback.HOOK`  | `boolean onAdvancementUpdate(ServerPlayer player, ClientboundUpdateAdvancementsPacket packet)`         | an advancement update packet is about to be sent |
| `PlayerRecipeNotificationCallback.HOOK` | `boolean onDisplay(ServerPlayer player, RecipeHolder<?> recipeEntry, RecipeDisplayEntry displayEntry)` | a recipe unlock notification is about to display |
| `CraftingRecipeCallback.HOOK`           | `PendingResult<ItemStack> modifyRecipe(ServerPlayer player, CraftingInput input, ItemStack result)`    | a crafting result is computed (modify it)        |

#### Player connection (`PlayerConnectionHooks`)
| Hook                                 | Signature                                                  | Fires when                          |
|--------------------------------------|------------------------------------------------------------|-------------------------------------|
| `PlayerConnectionHooks.JOIN`         | `void act(ServerPlayer player)`                            | a player joins                      |
| `PlayerConnectionHooks.QUIT`         | `void act(ServerPlayer player)`                            | a player quits                      |
| `PlayerConnectionHooks.JOIN_MESSAGE` | `Component onJoin(ServerPlayer player, Component message)` | a join message is built (modify it) |
| `PlayerConnectionHooks.QUIT_MESSAGE` | `Component onQuit(ServerPlayer player, Component message)` | a quit message is built (modify it) |

#### Player inventory (`PlayerInventoryHooks`)
| Hook                                               | Signature                                                              | Fires when                                          |
|----------------------------------------------------|------------------------------------------------------------------------|-----------------------------------------------------|
| `PlayerInventoryHooks.SLOT_CHANGE`                 | `void onChangeSlot(ServerPlayer player, int slot)`                     | a player's selected hotbar slot changes             |
| `PlayerInventoryHooks.DROP_ITEM`                   | `boolean onDropItem(Player player, int slot, boolean inInventory)`     | a player is about to drop an item                   |
| `PlayerInventoryHooks.DROPPED_ITEM`                | `void onDroppedItem(Player player, int slot)`                          | a player dropped an item                            |
| `PlayerInventoryHooks.DROP_ITEM_ENTITY`            | `boolean onDropItemEntity(ServerPlayer player, ItemEntity itemEntity)` | a dropped item entity is about to be created        |
| `PlayerInventoryHooks.DROPPED_ITEM_ENTITY`         | `void onDroppedItemEntity(ServerPlayer player, ItemEntity itemEntity)` | a dropped item entity was created                   |
| `PlayerInventoryHooks.SWAP_HANDS`                  | `boolean onSwapHands(ServerPlayer player, int slot)`                   | a player is about to swap hands                     |
| `PlayerInventoryHooks.SWAPPED_HANDS`               | `void onSwappedHands(ServerPlayer player, int slot)`                   | a player swapped hands                              |
| `PlayerInventoryHooks.MODIFY_INVENTORY`            | `boolean onModify(ClickEvent event)`                                   | an inventory click is about to modify the inventory |
| `PlayerInventoryHooks.MODIFIED_INVENTORY`          | `void onModified(ClickEvent event)`                                    | an inventory click modified the inventory           |
| `PlayerInventoryHooks.MODIFY_CREATIVE_INVENTORY`   | `void onModify(CreativeClickEvent event)`                              | a creative inventory action is about to apply       |
| `PlayerInventoryHooks.MODIFIED_CREATIVE_INVENTORY` | `void onModified(CreativeClickEvent event)`                            | a creative inventory action applied                 |
| `PlayerInventoryHooks.PLAYER_PICKUP`               | `boolean onPickup(Player player, ItemEntity itemEntity)`               | a player is about to pick up an item                |
| `PlayerInventoryHooks.PLAYER_PICKED_UP`            | `void onPickedUp(Player player, ItemEntity itemEntity)`                | a player picked up an item                          |

#### Player mount (`PlayerMountHooks`)
| Hook                          | Signature                                           | Fires when                    |
|-------------------------------|-----------------------------------------------------|-------------------------------|
| `PlayerMountHooks.MOUNTED`    | `void doAfter(ServerPlayer player, Entity vehicle)` | a player mounted a vehicle    |
| `PlayerMountHooks.DISMOUNTED` | `void doAfter(ServerPlayer player, Entity vehicle)` | a player dismounted a vehicle |

#### Player food (`PlayerFoodHooks`)
| Hook                                | Signature                                                         | Fires when                               |
|-------------------------------------|-------------------------------------------------------------------|------------------------------------------|
| `PlayerFoodHooks.SATURATION_CHANGE` | `boolean onChange(Player player, float fromLevel, float toLevel)` | a player's saturation is about to change |
| `PlayerFoodHooks.EXHAUSTION_CHANGE` | `boolean onChange(Player player, float fromLevel, float toLevel)` | a player's exhaustion is about to change |
| `PlayerFoodHooks.LEVEL_CHANGE`      | `boolean onChange(Player player, int fromLevel, int toLevel)`     | a player's food level is about to change |

#### Entity
| Hook                                  | Signature                                                                                                               | Fires when                                        |
|---------------------------------------|-------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------|
| `EntityDamageCallback.HOOK`           | `boolean onDamage(LivingEntity entity, DamageSource source, float amount)`                                              | a living entity is about to take damage           |
| `EntityHealthCallback.HOOK`           | `boolean onHealthChange(LivingEntity entity, float health)`                                                             | a living entity's health is about to change       |
| `NonLivingDamageCallback.HOOK`        | `boolean onDamage(Entity entity, DamageSource source, float amount)`                                                    | a non-living entity is about to take damage       |
| `EntityRemovedCallback.HOOK`          | `void onRemove(Entity entity, Entity.RemovalReason removalReason)`                                                      | an entity is removed                              |
| `EntityConvertCallback.HOOK`          | `boolean onConvert(Mob entity, EntityType<?> type)`                                                                     | a mob is about to convert into another type       |
| `EntityTargetCallback.HOOK`           | `boolean onChangeTarget(Mob entity, @Nullable LivingEntity target)`                                                     | a mob is about to change its target               |
| `EntityStatusEffectCallback.HOOK`     | `boolean onAddEffect(LivingEntity entity, MobEffectInstance effect, @Nullable Entity source)`                           | a status effect is about to be added              |
| `EntityMountCallback.HOOK`            | `boolean onMount(Entity entity, Entity vehicle, boolean force)`                                                         | an entity is about to mount a vehicle             |
| `EntityDismountCallback.HOOK`         | `boolean onDismount(Entity entity, Entity vehicle)`                                                                     | an entity is about to dismount                    |
| `EntityTeleportCallback.HOOK`         | `boolean onTeleport(Entity entity, double x, double y, double z)`                                                       | an entity is about to teleport                    |
| `EntityUsePortalCallback.HOOK`        | `boolean onUsePortal(Entity entity, Portal portal, BlockPos pos)`                                                       | an entity is about to use a portal                |
| `EntityDropItemCallback.HOOK`         | `boolean onDropItem(Level world, Entity entity, ItemEntity itemEntity)`                                                 | an entity is about to drop an item                |
| `EntityBossBarCallback.HOOK`          | `boolean onShow(Entity entity, ServerBossEvent bossBar, ServerPlayer player)`                                           | an entity's boss bar is about to show to a player |
| `AffectedByDaylightCallback.HOOK`     | `boolean shouldIgnoreDaylight(Mob entity)`                                                                              | whether a mob is affected by daylight is checked  |
| `ItemUseOnEntityCallback.HOOK`        | `boolean onUseOnEntity(Player player, LivingEntity entity, InteractionHand hand, ItemStack stack)`                      | an item is used on an entity                      |
| `WitherShootCallback.HOOK`            | `boolean onShootAt(WitherBoss wither, double targetX, double targetY, double targetZ)`                                  | a wither is about to shoot at a target            |
| `ProjectilePickupCallback.HOOK`       | `boolean onPickup(Player player, AbstractArrow projectile)`                                                             | a player is about to pick up a stuck projectile   |
| `ProjectileCanHitCallback.HOOK`       | `boolean canHit(Projectile projectile, Entity entity)`                                                                  | whether a projectile can hit an entity is checked |
| `ArmorStandManipulateCallback.HOOK`   | `boolean onManipulate(ArmorStand armorStand, Player player, EquipmentSlot slot, ItemStack stack, InteractionHand hand)` | an armor stand is about to be manipulated         |
| `ItemFramePutItemCallback.HOOK`       | `boolean onPutIntoFrame(ItemFrame itemFrame, ItemStack stack, Player player, InteractionHand hand)`                     | an item is about to be put into an item frame     |
| `ItemFrameRemoveItemCallback.HOOK`    | `boolean onRemoveItem(ItemFrame itemFrame, @Nullable Entity attacker)`                                                  | an item is about to be removed from an item frame |
| `ItemFrameRotateCallback.HOOK`        | `boolean onRotateFrame(ItemFrame itemFrame, Player player, InteractionHand hand)`                                       | an item frame is about to be rotated              |
| `ProjectileHooks.HIT_BLOCK`           | `void onHitBlock(Projectile projectile, BlockHitResult hit)`                                                            | a projectile hits a block                         |
| `ProjectileHooks.BREAK_DECORATED_POT` | `boolean onAffect(Projectile projectile, BlockHitResult hit)`                                                           | a projectile is about to break a decorated pot    |

#### Entity leashing
| Hook                                 | Signature                                                                                 | Fires when                                     |
|--------------------------------------|-------------------------------------------------------------------------------------------|------------------------------------------------|
| `LeashEntityCallback.HOOK`           | `boolean onLeash(Player player, Entity entity)`                                           | a player is about to leash an entity           |
| `UnleashEntityCallback.HOOK`         | `boolean onUnleash(Player player, Entity entity)`                                         | a player is about to unleash an entity         |
| `LeashEntitiesToEntityCallback.HOOK` | `boolean onLeashToEntity(Player player, Entity leashHolder, Collection<Entity> entities)` | entities are about to be leashed to an entity  |
| `LeashEntitiesToBlockCallback.HOOK`  | `boolean onLeashToBlock(Player player, BlockPos pos, Collection<Entity> entities)`        | entities are about to be leashed to a block    |
| `LeashKnotTakeCallback.HOOK`         | `boolean onTakeHold(Player player, LeashFenceKnotEntity leashKnot)`                       | a player is about to take hold of a leash knot |
| `LeashDestroyCallback.HOOK`          | `boolean onLeashDestroy(Player player, Entity leashed)`                                   | a leash is about to be destroyed               |

### kibu-fabric-hooks
These wrap [Fabric API](https://docs.fabricmc.net/develop/events) events so they can be unregistered like other kibu hooks. 
The callback type is the Fabric API interface, so the exact method signature is defined by Fabric API.

| Hook                                                     | Callback type                                     | Fires when                                   |
|----------------------------------------------------------|---------------------------------------------------|----------------------------------------------|
| `ServerLevelHooks.LOAD`                                  | `ServerLevelEvents.Load`                          | a server level loads                         |
| `ServerLevelHooks.UNLOAD`                                | `ServerLevelEvents.Unload`                        | a server level unloads                       |
| `ServerChunkHooks.CHUNK_LOAD`                            | `ServerChunkEvents.Load`                          | a chunk loads                                |
| `ServerChunkHooks.CHUNK_UNLOAD`                          | `ServerChunkEvents.Unload`                        | a chunk unloads                              |
| `ServerBlockEntityHooks.BLOCK_ENTITY_LOAD`               | `ServerBlockEntityEvents.Load`                    | a block entity loads                         |
| `ServerBlockEntityHooks.BLOCK_ENTITY_UNLOAD`             | `ServerBlockEntityEvents.Unload`                  | a block entity unloads                       |
| `ServerTickHooks.START_SERVER_TICK`                      | `ServerTickEvents.StartTick`                      | a server tick starts                         |
| `ServerTickHooks.END_SERVER_TICK`                        | `ServerTickEvents.EndTick`                        | a server tick ends                           |
| `ServerTickHooks.START_LEVEL_TICK`                       | `ServerTickEvents.StartLevelTick`                 | a level tick starts                          |
| `ServerTickHooks.END_LEVEL_TICK`                         | `ServerTickEvents.EndLevelTick`                   | a level tick ends                            |
| `ServerLifecycleHooks.SERVER_STARTING`                   | `ServerLifecycleEvents.ServerStarting`            | the server is starting                       |
| `ServerLifecycleHooks.SERVER_STARTED`                    | `ServerLifecycleEvents.ServerStarted`             | the server has started                       |
| `ServerLifecycleHooks.SERVER_STOPPING`                   | `ServerLifecycleEvents.ServerStopping`            | the server is stopping                       |
| `ServerLifecycleHooks.SERVER_STOPPED`                    | `ServerLifecycleEvents.ServerStopped`             | the server has stopped                       |
| `ServerLifecycleHooks.START_DATA_PACK_RELOAD`            | `ServerLifecycleEvents.StartDataPackReload`       | a data pack reload starts                    |
| `ServerLifecycleHooks.END_DATA_PACK_RELOAD`              | `ServerLifecycleEvents.EndDataPackReload`         | a data pack reload ends                      |
| `ServerPlayConnectionHooks.INIT`                         | `ServerPlayConnectionEvents.Init`                 | a play connection is initialized             |
| `ServerPlayConnectionHooks.JOIN`                         | `ServerPlayConnectionEvents.Join`                 | a play connection joins                      |
| `ServerPlayConnectionHooks.DISCONNECT`                   | `ServerPlayConnectionEvents.Disconnect`           | a play connection disconnects                |
| `ServerMessageHooks.ALLOW_CHAT_MESSAGE`                  | `ServerMessageEvents.AllowChatMessage`            | a chat message is about to be allowed        |
| `ServerMessageHooks.ALLOW_GAME_MESSAGE`                  | `ServerMessageEvents.AllowGameMessage`            | a game message is about to be allowed        |
| `ServerMessageHooks.ALLOW_COMMAND_MESSAGE`               | `ServerMessageEvents.AllowCommandMessage`         | a command message is about to be allowed     |
| `ServerMessageHooks.CHAT_MESSAGE`                        | `ServerMessageEvents.ChatMessage`                 | a chat message is sent                       |
| `ServerMessageHooks.GAME_MESSAGE`                        | `ServerMessageEvents.GameMessage`                 | a game message is sent                       |
| `ServerMessageHooks.COMMAND_MESSAGE`                     | `ServerMessageEvents.CommandMessage`              | a command message is sent                    |
| `ServerLivingEntityHooks.ALLOW_DAMAGE`                   | `ServerLivingEntityEvents.AllowDamage`            | living entity damage is about to be allowed  |
| `ServerLivingEntityHooks.ALLOW_DEATH`                    | `ServerLivingEntityEvents.AllowDeath`             | a living entity death is about to be allowed |
| `ServerLivingEntityHooks.AFTER_DEATH`                    | `ServerLivingEntityEvents.AfterDeath`             | a living entity died                         |
| `ServerEntityCombatHooks.AFTER_KILLED_OTHER_ENTITY`      | `ServerEntityCombatEvents.AfterKilledOtherEntity` | an entity killed another entity              |
| `ServerEntityHooks.ENTITY_LOAD`                          | `ServerEntityEvents.Load`                         | an entity loads                              |
| `ServerEntityHooks.ENTITY_UNLOAD`                        | `ServerEntityEvents.Unload`                       | an entity unloads                            |
| `ServerEntityHooks.EQUIPMENT_CHANGE`                     | `ServerEntityEvents.EquipmentChange`              | an entity's equipment changes                |
| `ServerEntityLevelChangeHooks.AFTER_ENTITY_CHANGE_LEVEL` | `ServerEntityLevelChangeEvents.AfterEntityChange` | an entity changed level                      |
| `ServerEntityLevelChangeHooks.AFTER_PLAYER_CHANGE_LEVEL` | `ServerEntityLevelChangeEvents.AfterPlayerChange` | a player changed level                       |
| `ServerPlayerHooks.COPY_FROM`                            | `ServerPlayerEvents.CopyFrom`                     | player data is copied on respawn             |
| `ServerPlayerHooks.AFTER_RESPAWN`                        | `ServerPlayerEvents.AfterRespawn`                 | a player respawned                           |
| `EntityTrackingHooks.START_TRACKING`                     | `EntityTrackingEvents.StartTracking`              | a player starts tracking an entity           |
| `EntityTrackingHooks.STOP_TRACKING`                      | `EntityTrackingEvents.StopTracking`               | a player stops tracking an entity            |
| `PlayerInteractionHooks.ATTACK_ENTITY`                   | `AttackEntityCallback`                            | a player attacks an entity                   |
| `PlayerInteractionHooks.ATTACK_BLOCK`                    | `AttackBlockCallback`                             | a player attacks a block                     |
| `PlayerInteractionHooks.BREAK_BLOCK`                     | `PlayerBlockBreakEvents.Before`                   | a player is about to break a block           |
| `PlayerInteractionHooks.USE_BLOCK`                       | `UseBlockCallback`                                | a player uses a block                        |
| `PlayerInteractionHooks.USE_ENTITY`                      | `UseEntityCallback`                               | a player uses an entity                      |
| `PlayerInteractionHooks.USE_ITEM`                        | `UseItemCallback`                                 | a player uses an item                        |

### kibu-map-api
| Hook                    | Signature                                                   | Fires when                      |
|-------------------------|-------------------------------------------------------------|---------------------------------|
| `MapStateCallback.HOOK` | `MapItemSavedData getMapState(ServerLevel world, MapId id)` | a map's saved state is resolved |

### kibu-translation-api
| Hook                           | Signature                                                             | Fires when                  |
|--------------------------------|-----------------------------------------------------------------------|-----------------------------|
| `LanguageChangedCallback.HOOK` | `void onChanged(ServerPlayer player, String language, Reason reason)` | a player's language changes |

## pal
Declared in `work.lclpnet.pal.event`. These gate the pal parkour/adventure elements.

| Hook                             | Signature                                                                   | Fires when                               |
|----------------------------------|-----------------------------------------------------------------------------|------------------------------------------|
| `AllowElevatorCallback.HOOK`     | `boolean canUseElevator(ServerPlayer player, BlockPos pos)`                 | a player is about to use an elevator     |
| `AllowTeleporterCallback.HOOK`   | `boolean canUseTeleporter(ServerPlayer player, BlockPos from, BlockPos to)` | a player is about to use a teleporter    |
| `AllowJumpPadCallback.HOOK`      | `boolean canUseJumPad(ServerPlayer player, BlockPos pos)`                   | a player is about to use a jump pad      |
| `AllowBoosterPlateCallback.HOOK` | `boolean canUseBoosterPlate(ServerPlayer player, BlockPos pos)`             | a player is about to use a booster plate |

## mg-lobby
Declared in `work.lclpnet.lobby.decor.seat.PlayerSeatCallback` (seat decorations).

| Hook                              | Signature                                           | Fires when                    |
|-----------------------------------|-----------------------------------------------------|-------------------------------|
| `PlayerSeatCallback.BEFORE_SIT`   | `boolean onSeat(ServerPlayer player, BlockPos pos)` | a player is about to sit down |
| `PlayerSeatCallback.AFTER_SIT`    | `void onSeated(ServerPlayer player, BlockPos pos)`  | a player sat down             |
| `PlayerSeatCallback.AFTER_GET_UP` | `void onGottenUp(ServerPlayer player)`              | a player got up from a seat   |

## combat-control
Declared in `work.lclpnet.combatctl.hook`.

| Hook                            | Signature                                                                                                                     | Fires when                                                 |
|---------------------------------|-------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------|
| `SwordBlockDamageCallback.HOOK` | `float calculateDamage(ServerPlayer player, DamageSource source, float originalDamage, float currentDamage, ItemStack stack)` | damage is reduced by sword blocking (return the new value) |

## game-map-utils
The `api` submodule declares hooks in `work.lclpnet.map_api.hook`, the main module in
`work.lclpnet.map_utils.hook`.

| Hook                                 | Signature                                                                            | Fires when                               |
|--------------------------------------|--------------------------------------------------------------------------------------|------------------------------------------|
| `GameMapApiReadyCallback.HOOK`       | `void onReady(GameMapApi api, MinecraftServer server)`                               | the game map API becomes ready           |
| `MapDataLoadedCallback.HOOK`         | `void onMapDataLoaded(ServerLevel world, WorldData worldData)`                       | a map's data has been loaded             |
| `VirtualEntityAttackCallback.HOOK`   | `void onAttack(ServerPlayer player, int entityId)`                                   | a player attacks a virtual entity        |
| `VirtualEntityInteractCallback.HOOK` | `void onInteract(ServerPlayer player, int entityId, InteractionHand hand, Vec3 pos)` | a player interacts with a virtual entity |
